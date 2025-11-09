import bcrypt from "bcrypt";
import pool from "../config/db.js";
import usersRepository from "../models/usersRepository.js";

// ========== REGISTER ==========
export const signup = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { name, email, password, role = "cliente" } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    await connection.beginTransaction();

    const existingUser = await usersRepository.findByEmail(connection, email);
    if (existingUser) {
      await connection.rollback();
      connection.release();
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserId = await usersRepository.createUser(connection, {
      name,
      role,
      email,
      password: hashedPassword,
    });

    await connection.commit();
    connection.release();

    // Iniciar sesión automáticamente tras registrarse
    req.session.userId = newUserId;

    return res.status(201).json({
      message: "Your profile has been created successfully.",
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Error creating user." });
  }
};

// ========== LOGIN ==========
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required." });

    const user = await usersRepository.findByEmail(pool, email);
    if (!user)
      return res
        .status(404)
        .json({ message: "Email or password are incorrect." });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res
        .status(401)
        .json({ message: "Email or password are incorrect." });

    req.session.userId = user.id_user;
    return res.status(200).json({
      message: "Login successful.",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Error logging in." });
  }
};

// ========== LOGOUT ==========
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Error logging out." });
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logout successful." });
  });
};

// ========== UPDATE USER ==========
export const updateUser = async (req, res) => {
  try {
    // if (!req.user || !req.user.id_user) {
    //   return res.status(401).json({ message: "Authentication required." });
    // }
    const { name, email, role, password } = req.body;
    const userId = req.user.id_user;

    // Validar datos opcionales
    const updates = {};
    if (name) updates.name = name;
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
      }
      updates.email = email;
    }
    if (role) updates.role = role;
    if (password) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long." });
      }
      updates.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update." });
    }

    const updated = await usersRepository.updateUser(pool, userId, updates);
    if (!updated) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "Error updating user." });
  }
};

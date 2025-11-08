import bcrypt from "bcrypt";
import pool from "../config/db.js";
import usersRepository from "../models/usersRepository.js";

// ========== REGISTER ==========
export const signup = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      name,
      email,
      password,
      role = "client",
    } = req.body;

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
      user_id: newUserId,
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
    if (!user) return res.status(404).json({ message: "User not found." });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ message: "Incorrect password." });

    req.session.userId = user.user_id;

    return res.status(200).json({
      message: "Login successful.",
      user_id: user.user_id,
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

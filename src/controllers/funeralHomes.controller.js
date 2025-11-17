import FuneralHomesRepository from "../models/funeralHomesRepository.js";
import UsersRepository from "../models/usersRepository.js";
import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const registerFuneralHome = async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      contact_email,
      user_name,
      user_email,
      password,
    } = req.body;

    // Validación básica
    if (
      !name ||
      !address ||
      !phone ||
      !contact_email ||
      !user_name ||
      !user_email ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validar duplicados
    const exists = await FuneralHomesRepository.findByNameOrEmail(pool, {
      name,
      contact_email,
    });

    if (exists)
      return res.status(409).json({ message: "Funeral home already exists." });

    const emailUsed = await UsersRepository.findByEmail(pool, user_email);
    if (emailUsed)
      return res.status(409).json({ message: "User email already in use." });

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1️⃣ Crear funeraria
      const id_funeral_home = await FuneralHomesRepository.createFuneralHome(
        connection,
        { name, address, phone, contact_email }
      );

      // 2️⃣ Crear usuario asociado
      const hashed = await bcrypt.hash(password, 10);

      await UsersRepository.createUser(connection, {
        name: user_name,
        email: user_email,
        password: hashed,
        role: "funeral_home",
        id_funeral_home,
        alive: 1,
        user_status: "active",
      });

      await connection.commit();
      connection.release();

      return res.status(201).json({
        message: "Funeral home and associated user registered successfully.",
        id_funeral_home,
      });
    } catch (error) {
      console.error(error);
      await connection.rollback();
      connection.release();
      return res.status(500).json({ message: "Transaction failed." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error registering funeral home.",
    });
  }
};

export const getFuneralHomes = async (req, res) => {
  try {
    const result = await FuneralHomesRepository.getAll(pool);
    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ message: "Error fetching funeral homes." });
  }
};

export const getFunerariaById = async (req, res) => {
  try {
    const { id } = req.params;

    const funeraria = await FuneralHomesRepository.findById(pool, id);

    if (!funeraria) {
      return res.status(404).json({ message: "Funeral home not found" });
    }

    res.json(funeraria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

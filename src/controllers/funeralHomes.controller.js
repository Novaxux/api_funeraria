import FuneralHomesRepository from "../models/funeralHomesRepository.js";
import pool from "../config/db.js";

export const registerFuneralHome = async (req, res) => {
  try {
    const { name, address, phone, contact_email } = req.body;
    if (!name || !address || !phone || !contact_email)
      return res.status(400).json({ message: "All fields are required." });

    const exists = await FuneralHomesRepository.findByNameOrEmail(pool, {
      name,
      contact_email,
    });

    if (exists)
      return res.status(409).json({
        message: "Funeral home already exists.",
      });

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const id = await FuneralHomesRepository.createFuneralHome(connection, {
        name,
        address,
        phone,
        contact_email,
      });

      await connection.commit();
      connection.release();

      return res.status(201).json({
        message: "Funeral home registered successfully.",
        id_funeral_home: id,
      });
    } catch {
      await connection.rollback();
      connection.release();
      return res.status(500).json({ message: "Transaction failed." });
    }
  } catch {
    return res.status(500).json({ message: "Error registering funeral home." });
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

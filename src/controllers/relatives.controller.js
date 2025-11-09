import relativesRepository from "../models/relativesRepository.js";
import pool from "../config/db.js"; // Asegúrate de importar el pool
const relativesRepo = relativesRepository(pool);

export const addRelative = async (req, res) => {
  try {
    console.log(req.session);
    const id_user = req.session?.user?.id;
    if (!id_user) return res.status(401).json({ message: "Unauthorized." });

    const { name, relationship, age, phone, email } = req.body;

    if (!name || !relationship || !phone || !email)
      return res.status(400).json({ message: "All fields are required." });

    // Check if relative already exists
    let relative = await relativesRepo.findByEmailOrPhone(email, phone);

    if (relative) {
      // If relation already exists, skip
      const exists = await relativesRepo.checkRelation(
        id_user,
        relative.id_relative
      );
      if (exists)
        return res.status(200).json({
          message: "Relative already linked to this user.",
          relative_id: relative.id_relative,
        });

      // Link existing relative
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
        await relativesRepo.linkRelativeToUser(
          connection,
          id_user,
          relative.id_relative
        );
        await connection.commit();
        connection.release();
      } catch (err) {
        await connection.rollback();
        connection.release();
        throw err;
      }

      return res.status(201).json({
        message: "Existing relative linked successfully.",
        relative_id: relative.id_relative,
      });
    }

    // Create new relative + link with transaction
    const id_relative = await relativesRepo.addRelativeTransaction({
      id_user,
      relativeData: { name, relationship, age, phone, email },
    });

    return res.status(201).json({
      message: "Relative added successfully.",
      relative_id: id_relative,
    });
  } catch (error) {
    console.error("Add relative error:", error);
    return res.status(500).json({ message: "Error adding relative." });
  }
};

export const removeRelative = async (req, res) => {
  try {
    const id_user = req.session.user.id;
    if (!id_user) return res.status(401).json({ message: "Unauthorized." });

    const { id_relative } = req.body;
    if (!id_relative)
      return res.status(400).json({ message: "Relative ID is required." });

    const relationExists = await relativesRepo.checkRelation(
      id_user,
      id_relative
    );

    if (!relationExists)
      return res
        .status(404)
        .json({ message: "Relation not found for this user." });

    await relativesRepo.unlinkRelativeFromUser(id_user, id_relative);

    return res.status(200).json({ message: "Relative removed successfully." });
  } catch (error) {
    console.error("Remove relative error:", error);
    return res.status(500).json({ message: "Error removing relative." });
  }
};

export const getRelatives = async (req, res) => {
  try {
    const id_user = req.session?.user?.id;
    if (!id_user) return res.status(401).json({ message: "Unauthorized." });

    const relatives = await relativesRepo.getRelativesByUser(id_user);

    return res.status(200).json({ relatives });
  } catch (error) {
    console.error("Get relatives error:", error);
    return res.status(500).json({ message: "Error fetching relatives." });
  }
};

export const getRelativeById = async (req, res) => {
  try {
    const id_user = req.session?.user?.id;
    if (!id_user) return res.status(401).json({ message: "Unauthorized." });

    const id_relative = parseInt(req.params.id, 10);
    if (Number.isNaN(id_relative)) return res.status(400).json({ message: "Invalid relative id." });

    const relative = await relativesRepo.getRelativeIfLinked(id_user, id_relative);
    if (!relative) return res.status(404).json({ message: "Relative not found or not linked to this user." });

    // Protect sensitive fields if any (for now we return only non-sensitive columns)
    const { id_relative: rid, name, relationship, age } = relative;
    return res.status(200).json({ relative: { id_relative: rid, name, relationship, age } });
  } catch (error) {
    console.error("Get relative by id error:", error);
    return res.status(500).json({ message: "Error fetching relative." });
  }
};

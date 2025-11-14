import memoriesRepository from "../models/memoriesRepository.js";
import pool from "../config/db.js";

const memoriesRepo = memoriesRepository(pool);

export const createMemory = async (req, res) => {
  try {
    const id_user = req.session.user.id;

    const { title, content, relativeIds = [] } = req.body;
    if (!content || content.trim() === "")
      return res.status(400).json({ message: "Content is required." });

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const id_memory = await memoriesRepo.createMemory(connection, {
        id_user,
        title: title || null,
        content,
      });

      await memoriesRepo.linkMemoryToRelatives(
        connection,
        id_memory,
        relativeIds
      );

      await connection.commit();
      connection.release();

      return res.status(201).json({
        message: "Memory saved successfully.",
        id_memory,
        relativeIds,
      });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (error) {
    console.error("Create memory error:", error);
    return res.status(500).json({ message: "Error saving memory." });
  }
};

export const editMemory = async (req, res) => {
  try {
    const { id_memory, title, content, relativeIds } = req.body;
    if (!id_memory)
      return res.status(400).json({ message: "Memory ID is required." });

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await memoriesRepo.updateMemory(connection, id_memory, {
        title,
        content,
      });

      // If relatives provided, replace links
      if (Array.isArray(relativeIds)) {
        await memoriesRepo.replaceMemoryRelatives(
          connection,
          id_memory,
          relativeIds
        );
      }

      await connection.commit();
      connection.release();

      return res
        .status(200)
        .json({ message: "Memory updated successfully.", relativeIds });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (error) {
    console.error("Edit memory error:", error);
    return res.status(500).json({ message: "Error updating memory." });
  }
};

export const getMemories = async (req, res) => {
  try {
    const id_user = req.session.user.id;

    const memories = await memoriesRepo.getMemoriesByUser(id_user);
    return res.status(200).json({ memories });
  } catch (error) {
    console.error("Get memories error:", error);
    return res.status(500).json({ message: "Error fetching memories." });
  }
};

export default {
  createMemory,
  editMemory,
  getMemories,
};

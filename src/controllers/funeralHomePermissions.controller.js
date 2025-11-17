import FuneralHomePermissionsRepository from "../models/funeralHomePermissionsRepository.js";
import pool from "../config/db.js";

export const getFuneralHomePermissions = async (req, res) => {
  try {
    const { id_funeral_home } = req.params;

    const permissions = await FuneralHomePermissionsRepository.getPermissions(
      pool,
      id_funeral_home
    );

    return res.status(200).json(permissions);
  } catch {
    return res.status(500).json({ message: "Error fetching permissions." });
  }
};

export const updateFuneralHomePermission = async (req, res) => {
  try {
    const { id_funeral_home, permission, granted } = req.body;
    if (!id_funeral_home || !permission)
      return res.status(400).json({ message: "Missing fields." });

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const exists = await FuneralHomePermissionsRepository.findPermission(
        pool,
        {
          id_funeral_home,
          permission,
        }
      );

      if (exists) {
        await FuneralHomePermissionsRepository.updatePermission(connection, {
          id_funeral_home,
          permission,
          granted,
        });
      } else {
        await FuneralHomePermissionsRepository.createPermission(connection, {
          id_funeral_home,
          permission,
        });
      }

      await connection.commit();
      connection.release();

      return res
        .status(200)
        .json({ message: "Permissions updated successfully." });
    } catch {
      await connection.rollback();
      connection.release();
      return res.status(500).json({ message: "Transaction failed." });
    }
  } catch {
    return res.status(500).json({ message: "Error updating permissions." });
  }
};

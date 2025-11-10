import RelativesRepository from "../models/relativesRepository.js";
import pool from "../config/db.js";

export const addRelative = async (req, res) => {
  try {
    const id_user = req.session?.user?.id;
    if (!id_user) return res.status(401).json({ message: "Unauthorized." });

    const { name, relationship, age, phone, email } = req.body;
    if (!name || !relationship || !phone || !email)
      return res.status(400).json({ message: "All fields are required." });

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Check if relative exists
      let relative = await RelativesRepository.findByEmailOrPhone(pool, {
        email,
        phone,
      });

      if (relative) {
        // Check if already linked
        const alreadyLinked = await RelativesRepository.checkRelation(
          pool,
          id_user,
          relative.id_relative
        );

        if (alreadyLinked) {
          await connection.rollback();
          connection.release();
          return res.status(200).json({
            message: "Relative already linked to this user.",
            relative_id: relative.id_relative,
          });
        }

        // Link existing relative
        await RelativesRepository.linkRelativeToUser(connection, {
          id_user,
          id_relative: relative.id_relative,
          name,
          age,
          relationship,
        });

        await connection.commit();
        connection.release();

        return res.status(201).json({
          message: "Existing relative linked successfully.",
          relative_id: relative.id_relative,
        });
      }

      // Create new relative
      const id_relative = await RelativesRepository.createRelative(connection, {
        email,
        phone,
      });

      // Link new relative
      await RelativesRepository.linkRelativeToUser(connection, {
        id_user,
        id_relative,
        name,
        age,
        relationship,
      });

      await connection.commit();
      connection.release();

      return res.status(201).json({
        message: "Relative added successfully.",
        relative_id: id_relative,
      });
    } catch (err) {
      await connection.rollback();
      connection.release();
      console.error("Transaction error:", err);
      return res.status(500).json({ message: "Transaction failed." });
    }
  } catch (error) {
    console.error("Add relative error:", error);
    return res.status(500).json({ message: "Error adding relative." });
  }
};

export const removeRelative = async (req, res) => {
  try {
    const id_user = req.session?.user?.id;
    if (!id_user) return res.status(401).json({ message: "Unauthorized." });

    const { id_relative } = req.body;
    if (!id_relative)
      return res.status(400).json({ message: "Relative ID is required." });

    const relationExists = await RelativesRepository.checkRelation(
      pool,
      id_user,
      id_relative
    );

    if (!relationExists)
      return res
        .status(404)
        .json({ message: "Relation not found for this user." });

    await RelativesRepository.unlinkRelativeFromUser(
      pool,
      id_user,
      id_relative
    );
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

    const relatives = await RelativesRepository.getRelativesByUser(
      pool,
      id_user
    );
    return res.status(200).json(relatives);
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
    if (Number.isNaN(id_relative))
      return res.status(400).json({ message: "Invalid relative id." });

    const relative = await RelativesRepository.getRelativeIfLinked(
      pool,
      id_user,
      id_relative
    );

    if (!relative)
      return res.status(404).json({
        message: "Relative not found or not linked to this user.",
      });

    return res.status(200).json(relative);
  } catch (error) {
    console.error("Get relative by id error:", error);
    return res.status(500).json({ message: "Error fetching relative." });
  }
};

export const editRelative = async (req, res) => {
  try {
    const id_user = req.session?.user?.id;
    if (!id_user) return res.status(401).json({ message: "Unauthorized." });

    const { id_relative, name, age, relationship, phone, email } = req.body;
    if (!id_relative)
      return res.status(400).json({ message: "Relative ID required." });

    // Verifica si el familiar está vinculado al usuario
    const currentRelative = await RelativesRepository.getRelativeIfLinked(
      pool,
      id_user,
      id_relative
    );
    if (!currentRelative)
      return res.status(404).json({
        message: "Relative not found or not linked to this user.",
      });

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Si se intenta editar email o phone
      if (
        (email && email !== currentRelative.email) ||
        (phone && phone !== currentRelative.phone)
      ) {
        // Ambos deben ser diferentes para crear uno nuevo
        if (
          email &&
          phone &&
          email !== currentRelative.email &&
          phone !== currentRelative.phone
        ) {
          // Verifica si ya existe ese familiar
          const exists = await RelativesRepository.findByEmailOrPhone(pool, {
            email,
            phone,
          });
          if (exists) {
            await connection.rollback();
            connection.release();
            return res.status(409).json({
              message: "Ya existe un familiar con ese correo y teléfono.",
            });
          }
          // Crea nuevo familiar y vincula
          const createdId = await RelativesRepository.createRelative(
            connection,
            {
              email,
              phone,
            }
          );
          await RelativesRepository.unlinkRelativeFromUser(
            connection,
            id_user,
            id_relative
          );
          await RelativesRepository.linkRelativeToUser(connection, {
            id_user,
            id_relative: createdId,
            name,
            age,
            relationship,
          });
          await connection.commit();
          connection.release();
          return res.status(200).json({
            message: "Familiar actualizado y creado correctamente.",
            relative_id: createdId,
          });
        } else {
          await connection.rollback();
          connection.release();
          return res.status(400).json({
            message:
              "Para cambiar correo y teléfono debes proporcionar ambos y que sean diferentes.",
          });
        }
      } else {
        // Solo actualiza los campos enviados en la relación
        const updated = await RelativesRepository.updateRelativeRelation(
          connection,
          id_user,
          id_relative,
          { name, age, relationship }
        );
        await connection.commit();
        connection.release();
        return res.status(200).json({
          message: updated
            ? "Familiar actualizado correctamente."
            : "No se enviaron campos para actualizar.",
          relative_id: id_relative,
        });
      }
    } catch (err) {
      await connection.rollback();
      connection.release();
      console.error("Edit relative error:", err);
      return res.status(500).json({ message: "Transaction failed." });
    }
  } catch (error) {
    console.error("Edit relative error:", error);
    return res.status(500).json({ message: "Error editing relative." });
  }
};

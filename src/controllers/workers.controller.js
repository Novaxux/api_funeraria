import WorkersRepository from "../models/WorkersRepository.js";
import pool from "../config/db.js";

export const registerWorker = async (req, res) => {
  try {
    const id_funeral_home = req.user.id_funeral_home;
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields." });

    const id = await WorkersRepository.createWorker(pool, {
      name,
      email,
      password,
      id_funeral_home,
    });

    if (!id)
      return res.status(409).json({ message: "Email already registered." });

    return res.status(201).json({ message: "Worker registered successfully." });
  } catch (error) {
    console.error("Register worker error:", error);
    return res.status(500).json({ message: "Error registering worker." });
  }
};

export const listWorkers = async (req, res) => {
  try {
    const id_funeral_home = req.user.id_funeral_home;

    const workers = await WorkersRepository.getWorkersByFuneralHome(
      pool,
      id_funeral_home
    );

    return res.status(200).json(workers);
  } catch {
    return res.status(500).json({ message: "Error fetching workers." });
  }
};

export const updateWorker = async (req, res) => {
  try {
    const { id_user } = req.params;
    const { name, email } = req.body;

    await WorkersRepository.updateWorker(pool, { id_user, name, email });

    return res.status(200).json({ message: "Worker updated successfully." });
  } catch {
    return res.status(500).json({ message: "Error updating worker." });
  }
};

export const deleteWorker = async (req, res) => {
  try {
    const { id_user } = req.params;

    await WorkersRepository.deleteWorker(pool, id_user);

    return res.status(200).json({ message: "Worker deleted successfully." });
  } catch {
    return res.status(500).json({ message: "Error deleting worker." });
  }
};

export const searchClients = async (req, res) => {
  try {
    const { q } = req.query;

    const users = await WorkersRepository.searchUsers(pool, q);

    return res.status(200).json(users);
  } catch {
    return res.status(500).json({ message: "Error searching users." });
  }
};

export const updateClientStatus = async (req, res) => {
  try {
    const { id_user } = req.params;
    const { alive, death_date } = req.body;

    await WorkersRepository.updateStatus(pool, { id_user, alive, death_date });

    return res
      .status(200)
      .json({ message: "Client status updated successfully." });
  } catch {
    return res.status(500).json({ message: "Error updating client status." });
  }
};

export const getClientInfo = async (req, res) => {
  try {
    const { id_user } = req.params;

    const data = await WorkersRepository.getMemoriesAndRelatives(pool, id_user);

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ message: "Error fetching client info." });
  }
};

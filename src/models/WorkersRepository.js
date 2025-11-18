export default class WorkersRepository {
  static async createWorker(pool, worker) {
    const { name, email, hashedPassword, id_funeral_home } = worker;

    const [exists] = await pool.query(
      `SELECT id_user FROM users WHERE email = ? LIMIT 1`,
      [email]
    );
    if (exists.length > 0) return null;

    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, role, id_funeral_home)
       VALUES (?, ?, ?, 'worker', ?)`,
      [name, email, hashedPassword, id_funeral_home]
    );

    return result.insertId;
  }

  static async getWorkersByFuneralHome(pool, id_funeral_home) {
    const [rows] = await pool.query(
      `SELECT id_user, name, email, user_status 
       FROM users 
       WHERE role = 'worker' AND id_funeral_home = ? AND user_status = 'active'`,
      [id_funeral_home]
    );
    return rows;
  }

  static async getWorkerById(pool, id_user) {
    const [rows] = await pool.query(
      `SELECT id_user, name, email, user_status, id_funeral_home 
       FROM users WHERE id_user = ? AND role = 'worker' LIMIT 1`,
      [id_user]
    );
    return rows[0];
  }

  static async updateWorker(pool, worker) {
    const { id_user, name, email } = worker;

    await pool.query(
      `UPDATE users 
       SET name = ?, email = ? 
       WHERE id_user = ? AND role = 'worker'`,
      [name, email, id_user]
    );
  }

  static async deleteWorker(pool, id_user) {
    await pool.query(
      `UPDATE users SET user_status = 'inactive' WHERE id_user = ? AND role = 'worker'`,
      [id_user]
    );
  }

  // For searching users (clients)
  static async searchUsers(pool, query) {
    const like = `%${query}%`;

    const [rows] = await pool.query(
      `SELECT id_user, name, email, alive, death_date 
       FROM users 
       WHERE role = 'cliente'
       AND (name LIKE ? OR email LIKE ? OR id_user LIKE ?)`,
      [like, like, like]
    );

    return rows;
  }

  static async updateStatus(pool, { id_user, alive, death_date }) {
    await pool.query(
      `UPDATE users SET alive = ?, death_date = ? WHERE id_user = ? AND role = 'cliente'`,
      [alive, death_date, id_user]
    );
  }

  static async getMemoriesAndRelatives(pool, id_user) {
    // Memories
    const [memories] = await pool.query(
      `SELECT id_memory, title, content, delivered, delivery_date 
       FROM memories WHERE id_user = ?`,
      [id_user]
    );

    // Relatives
    const [relatives] = await pool.query(
      `SELECT r.id_relative, ru.name, ru.relationship, r.phone, r.email 
       FROM relatives_users ru
       INNER JOIN relatives r ON ru.id_relative = r.id_relative
       WHERE ru.id_user = ?`,
      [id_user]
    );

    return { memories, relatives };
  }
}

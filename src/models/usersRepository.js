const UsersRepository = {
  async createUser(
    pool,
    { name, role, email, password, id_funeral_home = null }
  ) {
    const [result] = await pool.query(
      `INSERT INTO users (name, role, email, password, id_funeral_home)
     VALUES (?, ?, ?, ?, ?)`,
      [name, role, email, password, id_funeral_home]
    );
    return result.insertId;
  },

  async findByEmail(pool, email) {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE email = ? LIMIT 1`,
      [email]
    );
    return rows[0];
  },

  async findById(pool, userId) {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE id_user = ? LIMIT 1`,
      [userId]
    );
    return rows[0];
  },

  async updateUser(pool, userId, data) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) return null;

    values.push(userId);

    const [result] = await pool.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id_user = ?`,
      values
    );
    return result.affectedRows > 0;
  },
};

export default UsersRepository;

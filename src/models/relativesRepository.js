export default class RelativesRepository {
  static async findByEmailOrPhone(pool, { email, phone }) {
    const [rows] = await pool.query(
      `SELECT * FROM relatives WHERE email = ? OR phone = ? LIMIT 1`,
      [email, phone]
    );
    return rows[0];
  }

  static async createRelative(connection, { email, phone }) {
    const [result] = await connection.query(
      `INSERT INTO relatives (email, phone) VALUES (?, ?)`,
      [email, phone]
    );
    return result.insertId;
  }

  static async linkRelativeToUser(
    connection,
    { id_user, id_relative, name, age, relationship }
  ) {
    await connection.query(
      `INSERT INTO relatives_users (id_user, id_relative, name, age, relationship)
       VALUES (?, ?, ?, ?, ?)`,
      [id_user, id_relative, name, age || null, relationship]
    );
  }

  static async checkRelation(pool, id_user, id_relative) {
    const [rows] = await pool.query(
      `SELECT 1 FROM relatives_users 
       WHERE id_user = ? AND id_relative = ? LIMIT 1`,
      [id_user, id_relative]
    );
    return rows.length > 0;
  }

  static async getRelativesByUser(pool, id_user) {
    const [rows] = await pool.query(
      `SELECT r.id_relative, r.email, r.phone, 
              ru.name, ru.age, ru.relationship
       FROM relatives r
       JOIN relatives_users ru ON r.id_relative = ru.id_relative
       WHERE ru.id_user = ?`,
      [id_user]
    );
    return rows;
  }

  static async getRelativeIfLinked(pool, id_user, id_relative) {
    const [rows] = await pool.query(
      `SELECT r.id_relative, r.email, r.phone,
              ru.name, ru.age, ru.relationship
       FROM relatives r
       JOIN relatives_users ru ON r.id_relative = ru.id_relative
       WHERE ru.id_user = ? AND r.id_relative = ? 
       LIMIT 1`,
      [id_user, id_relative]
    );
    return rows[0];
  }

  static async unlinkRelativeFromUser(pool, id_user, id_relative) {
    await pool.query(
      `DELETE FROM relatives_users 
       WHERE id_user = ? AND id_relative = ?`,
      [id_user, id_relative]
    );
  }
}

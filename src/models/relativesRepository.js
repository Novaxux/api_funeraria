export default function relativesRepository(pool) {
  return {
    // Find existing relative by email or phone
    async findByEmailOrPhone(email, phone) {
      const [rows] = await pool.query(
        `SELECT * FROM relatives WHERE email = ? OR phone = ? LIMIT 1`,
        [email, phone]
      );
      return rows[0] || null;
    },

    // Create a new relative (inside a transaction if needed)
    async createRelative(
      connection,
      { name, relationship, age, phone, email }
    ) {
      const [result] = await connection.query(
        `INSERT INTO relatives (name, relationship, age, phone, email)
         VALUES (?, ?, ?, ?, ?)`,
        [name, relationship, age, phone, email]
      );
      return result.insertId;
    },

    // Check if relation already exists
    async checkRelation(id_user, id_relative) {
      const [rows] = await pool.query(
        `SELECT 1 FROM relatives_users WHERE id_user = ? AND id_relative = ?`,
        [id_user, id_relative]
      );
      return rows.length > 0;
    },

    // Link relative to user (can use connection if inside a transaction)
    async linkRelativeToUser(connection, id_user, id_relative) {
      await connection.query(
        `INSERT INTO relatives_users (id_user, id_relative)
         VALUES (?, ?)`,
        [id_user, id_relative]
      );
    },

    // Unlink relative from user
    async unlinkRelativeFromUser(id_user, id_relative) {
      await pool.query(
        `DELETE FROM relatives_users WHERE id_user = ? AND id_relative = ?`,
        [id_user, id_relative]
      );
    },

    // Get a relative only if it's linked to the given user
    async getRelativeIfLinked(id_user, id_relative) {
      const [rows] = await pool.query(
        `SELECT r.* FROM relatives r
         JOIN relatives_users ru ON ru.id_relative = r.id_relative
         WHERE ru.id_user = ? AND r.id_relative = ? LIMIT 1`,
        [id_user, id_relative]
      );
      return rows[0] || null;
    },

    // Add relative with transaction (create + link)
    async addRelativeTransaction({ id_user, relativeData }) {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        // Create new relative
        const id_relative = await this.createRelative(connection, relativeData);

        // Link to user
        await this.linkRelativeToUser(connection, id_user, id_relative);

        await connection.commit();
        connection.release();

        return id_relative;
      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      }
    },
    // Get all relatives linked to a user
    async getRelativesByUser(id_user) {
      const [rows] = await pool.query(
        `SELECT r.* FROM relatives r
         JOIN relatives_users ru ON ru.id_relative = r.id_relative
         WHERE ru.id_user = ?`,
        [id_user]
      );
      return rows;
    },
  };
}

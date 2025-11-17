export default class FuneralHomesRepository {
  static async findByNameOrEmail(pool, { name, contact_email }) {
    const [rows] = await pool.query(
      `SELECT * FROM funeral_homes WHERE name = ? OR contact_email = ? LIMIT 1`,
      [name, contact_email]
    );
    return rows[0];
  }

  static async createFuneralHome(connection, data) {
    const { name, address, phone, contact_email } = data;
    const [result] = await connection.query(
      `INSERT INTO funeral_homes (name, address, phone, contact_email)
       VALUES (?, ?, ?, ?)`,
      [name, address, phone, contact_email]
    );
    return result.insertId;
  }

  static async getAll(pool) {
    const [rows] = await pool.query(`SELECT * FROM funeral_homes`);
    return rows;
  }

  static async findById(pool, id) {
    const [rows] = await pool.query(
      "SELECT * FROM funeral_homes WHERE id_funeral_home = ?",
      [id]
    );
    return rows[0] || null;
  }
}

export default class FuneralHomePermissionsRepository {
  static async getPermissions(pool, id_funeral_home) {
    const [rows] = await pool.query(
      `SELECT * FROM funeral_home_permissions WHERE id_funeral_home = ?`,
      [id_funeral_home]
    );
    return rows;
  }

  static async updatePermission(
    connection,
    { id_funeral_home, permission, granted }
  ) {
    await connection.query(
      `UPDATE funeral_home_permissions
       SET granted = ?
       WHERE id_funeral_home = ? AND permission = ?`,
      [granted, id_funeral_home, permission]
    );
  }

  static async createPermission(connection, { id_funeral_home, permission }) {
    await connection.query(
      `INSERT INTO funeral_home_permissions (id_funeral_home, permission)
       VALUES (?, ?)`,
      [id_funeral_home, permission]
    );
  }

  static async findPermission(pool, { id_funeral_home, permission }) {
    const [rows] = await pool.query(
      `SELECT * FROM funeral_home_permissions
       WHERE id_funeral_home = ? AND permission = ? LIMIT 1`,
      [id_funeral_home, permission]
    );
    return rows[0];
  }
}

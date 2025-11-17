export default class SystemMonitoringRepository {
  static async getStats(pool) {
    const queries = [
      pool.query(`SELECT COUNT(*) AS total_users FROM users`),
      pool.query(
        `SELECT COUNT(*) AS active_users FROM users WHERE user_status = 'active'`
      ),
      pool.query(`SELECT COUNT(*) AS total_funerals FROM funeral_homes`),
      pool.query(`SELECT COUNT(*) AS deceased FROM users WHERE alive = 0`),
    ];

    const results = await Promise.all(queries);

    return {
      total_users: results[0][0][0].total_users,
      active_users: results[1][0][0].active_users,
      funeral_homes: results[2][0][0].total_funerals,
      deceased: results[3][0][0].deceased,
    };
  }

  // Search across funeral_homes and users (including deceased users where alive = 0)
  static async search(pool, filters) {
    const { funeralhome, user, deceased } = filters;
    const results = {};

    // Search funeral homes
    if (funeralhome) {
      const like = `%${funeralhome}%`;

      const [rows] = await pool.query(
        `SELECT id_funeral_home AS id, name, address, phone, contact_email, funeral_home_status
         FROM funeral_homes
         WHERE name LIKE ? 
         OR address LIKE ?
         OR contact_email LIKE ?
         OR phone LIKE ?`,
        [like, like, like, like]
      );

      results.funeralHomes = rows;
    }

    // Search users
    if (user) {
      const like = `%${user}%`;

      const [rows] = await pool.query(
        `SELECT id_user AS id, name, role, email, user_status, id_funeral_home
         FROM users
         WHERE name LIKE ?
         OR email LIKE ?
         OR role LIKE ?`,
        [like, like, like]
      );

      results.users = rows;
    }

    // Search deceased users
    if (deceased) {
      const like = `%${deceased}%`;

      const [rows] = await pool.query(
        `SELECT id_user AS id, name, email, death_date
         FROM users
         WHERE alive = 0
         AND (name LIKE ? OR email LIKE ? OR death_date LIKE ?)`,
        [like, like, like]
      );

      results.deceased = rows;
    }

    return results;
  }
}

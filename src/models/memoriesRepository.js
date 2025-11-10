export default function memoriesRepository(pool) {
  return {
    // Create a memory using a provided connection (for transactions)
    async createMemory(connection, { id_user, title, content }) {
      const [result] = await connection.query(
        `INSERT INTO memories (id_user, title, content) VALUES (?, ?, ?)`,
        [id_user, title, content]
      );
      return result.insertId;
    },

    // Link a memory to multiple relatives using the provided connection
    async linkMemoryToRelatives(connection, id_memory, relativeIds = []) {
      if (!relativeIds || relativeIds.length === 0) return;
      const values = relativeIds.map((id) => [id_memory, id]);
      await connection.query(
        `INSERT INTO memories_relatives (id_memory, id_relative) VALUES ?`,
        [values]
      );
    },

    // Get all memories for a specific user (optionally include relatives)
    async getMemoriesByUser(id_user) {
      const [memories] = await pool.query(
        `SELECT m.* FROM memories m WHERE m.id_user = ? ORDER BY m.created_at DESC`,
        [id_user]
      );

      // For each memory, fetch linked relatives
      for (const memory of memories) {
        const [rels] = await pool.query(
          `SELECT r.id_relative FROM relatives r JOIN memories_relatives mr ON mr.id_relative = r.id_relative WHERE mr.id_memory = ?`,
          [memory.id_memory]
        );
        // Map to array of ids only
        memory.relatives = rels.map((r) => r.id_relative);
      }

      return memories;
    },

    // Update an existing memory using provided connection
    async updateMemory(
      connection,
      id_memory,
      { title, content, delivered, delivery_date }
    ) {
      const fields = [];
      const params = [];
      if (title !== undefined) {
        fields.push(`title = ?`);
        params.push(title);
      }
      if (content !== undefined) {
        fields.push(`content = ?`);
        params.push(content);
      }
      if (delivered !== undefined) {
        fields.push(`delivered = ?`);
        params.push(delivered);
      }
      if (delivery_date !== undefined) {
        fields.push(`delivery_date = ?`);
        params.push(delivery_date);
      }
      if (fields.length === 0) return;

      params.push(id_memory);
      const sql = `UPDATE memories SET ${fields.join(", ")} WHERE id_memory = ?`;
      await connection.query(sql, params);
    },

    // Replace linked relatives for a memory (transaction-friendly)
    async replaceMemoryRelatives(connection, id_memory, relativeIds = []) {
      await connection.query(
        `DELETE FROM memories_relatives WHERE id_memory = ?`,
        [id_memory]
      );
      if (!relativeIds || relativeIds.length === 0) return;
      const values = relativeIds.map((id) => [id_memory, id]);
      await connection.query(
        `INSERT INTO memories_relatives (id_memory, id_relative) VALUES ?`,
        [values]
      );
    },
  };
}

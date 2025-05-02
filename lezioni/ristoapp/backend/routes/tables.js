async function routes(fastify, options) {
  // ottiene tutti i tavoli
  fastify.get("/", async (request, reply) => {
    const client = await fastify.pg.connect();

    try {
      const { rows } = await client.query(
        `SELECT * FROM tables ORDER BY number`
      );
      return { table: rows };
    } catch (error) {
      reply.code(500).send({
        error: "Si è verificato un errore durante la lettura dei tavoli",
      });
    } finally {
      client.release();
    }
  });

  // ottiene un singolo tavolo in base a ID
  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params;
    const client = await fastify.pg.connect();

    try {
      const { rows } = await client.query(`SELECT * FROM tables WHERE id=$1`, [
        id,
      ]);

      if (rows.length === 0) {
        return reply.code(404).send({
          error: "Elemento non trovato",
        });
      }

      return { table: rows };
    } catch (error) {
      reply.code(500).send({
        error: "Si è verificato un errore durante la ricerca del tavolo",
      });
    } finally {
      client.release();
    }
  });

  // crea un nuovo tavolo
  fastify.post("/", {
    preValidation: [fastify.authenticate],
    handler: async (request, reply) => {
      if (!["admin", "chef"].includes(request.user.role)) {
        return reply.code(403).send({ error: "Non autorizzato" });
      }

      const { number, seats, status = "free" } = request.body;

      const client = await fastify.pg.connect();

      try {
        const check = await client.query(
          `SELECT id FROM tables WHERE number = $1`,
          [number]
        );

        if (check.rows.length > 0) {
          return reply.code(400).send({ error: "tavolo già in uso" });
        }

        const { rows } = await client.query(
          `INSERT INTO tables (number, seats, status) VALUES ($1, $2, $3) RETURNING *`,
          [number, seats, status]
        );

        return { table: rows[0] };
      } catch (error) {
        reply.code(500).send({
          error:
            "Si è verificato un errore durante la creazione del nuovo tavolo",
        });
      } finally {
        client.release();
      }
    },
  });

  // aggiornamento dello status di un tavolo
  fastify.put("/:status", {
    preValidation: [fastify.authenticate],
    handler: async (request, reply) => {
      if (!["admin", "chef"].includes(request.user.role)) {
        return reply.code(403).send({ error: "Non autorizzato" });
      }

      const { id } = request.params;

      const { status } = request.body;

      const client = await fastify.pg.connect();

      try {
        const { rows } = await client.query(
          `UPDATE tables SET status = $1 WHERE id = $2 RETURNING *`,
          [status, id]
        );

        if (rows.length === 0) {
          return reply.code(404).send({ error: "Elemento non trovato" });
        }
        return { table: rows[0] };
      } catch (error) {
        reply.code(500).send({
          error:
            "Si è verificato un errore durante l'aggiornamento dello stato del tavolo",
        });
      } finally {
        client.release();
      }
    },
  });

  // eliminazione di un elemento del menù
  fastify.delete("/:id", {
    preValidation: [fastify.authenticate],
    handler: async (request, reply) => {
      if (!["admin", "chef"].includes(request.user.role)) {
        return reply.code(403).send({ error: "Non autorizzato" });
      }

      const { id } = request.params;

      const client = await fastify.pg.connect();

      try {
        const { rowCount } = await client.query(
          `DELETE FROM menu_items WHERE id = $1`,
          [id]
        );

        if (rowCount.length === 0) {
          return reply.code(404).send({ error: "Elemento non trovato" });
        }
        return { success: true };
      } catch (error) {
        reply.code(500).send({
          error:
            "Si è verificato un errore durante l'eliminazione dell' elemento del menù",
        });
      } finally {
        client.release();
      }
    },
  });
}

module.exports = routes;

async function routes(fastify, options) {
  // ottiene tuttti gli elementi del menù
  fastify.get("/", async (request, reply) => {
    const client = await fastify.pg.connect();

    try {
      const { rows } = await client.query(
        `SELECT * FROM menu_items ORDER BY category, name`
      );
      return { items: rows };
    } catch (error) {
      reply.code(500).send({
        error:
          "Si è verificato un errore durante la lettura degli elementi del menù",
      });
    } finally {
      client.release();
    }
  });

  // ottiene un singolo elemento del menù in base a ID
  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params;
    const client = await fastify.pg.connect();

    try {
      const { rows } = await client.query(
        `SELECT * FROM menu_items WHERE id=$1`,
        [id]
      );

      if (rows.length === 0) {
        return reply.code(404).send({
          error: "Elemento non trovato",
        });
      }

      return { items: rows };
    } catch (error) {
      reply.code(500).send({
        error:
          "Si è verificato un errore durante la ricerca degli elementi del menù",
      });
    } finally {
      client.release();
    }
  });

  // crea un nuovo elemento del menù
  fastify.post("/", {
    preValidation: [fastify.authenticate],
    handler: async (request, reply) => {
      if (!["admin", "chef"].includes(request.user.role)) {
        return reply.code(403).send({ error: "Non autorizzato" });
      }

      const {
        name,
        description,
        price,
        category,
        available = true,
      } = request.body;

      const client = await fastify.pg.connect();

      try {
        const { rows } = await client.query(
          `INSERT INTO menu_items (name,
        description,
        price,
        category,
        available) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [name, description, price, category, available]
        );

        return { items: rows[0] };
      } catch (error) {
        reply.code(500).send({
          error:
            "Si è verificato un errore durante la creazione del nuovo elemento del menù",
        });
      } finally {
        client.release();
      }
    },
  });

  // aggiornamento di un elemento del menù
  fastify.put("/:id", {
    preValidation: [fastify.authenticate],
    handler: async (request, reply) => {
      if (!["admin", "chef"].includes(request.user.role)) {
        return reply.code(403).send({ error: "Non autorizzato" });
      }

      const { id } = request.params;

      const {
        name,
        description,
        price,
        category,
        available = true,
      } = request.body;

      const client = await fastify.pg.connect();

      try {
        const { rows } = await client.query(
          `UPDATE menu_items SET name = $1, description = $2, price = $3, category = $4, available = $5 WHERE id = $6 RETURNING *`,
          [name, description, price, category, available, id]
        );

        if (rows.length === 0) {
          return reply.code(404).send({ error: "Elemento non trovato" });
        }
        return { items: rows[0] };
      } catch (error) {
        reply.code(500).send({
          error:
            "Si è verificato un errore durante l'aggiornamento dell' elemento del menù",
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

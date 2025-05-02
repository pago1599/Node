const bcrypt = require("bcrypt");

async function routes(fastify, options) {
  fastify.post("/login", async (request, reply) => {
    const { username, password } = request.body;

    const client = await fastify.pg.connect();

    try {
      const { rows } = await client.query(
        `SELECT id, username, password, role FROM users WHERE username = $1`,
        [username]
      );

      if (rows.length === 0) {
        return reply.code(401).send({ error: "Credenziali non valide" });
      }

      const user = rows[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return reply.code(401).send({ error: "Credenziali non valide" });
      }

      const token = fastify.jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        {
          expiresIn: "1h",
        }
      );

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      };
    } catch (error) {
      reply.code(500).send(error);
    } finally {
      client.release();
    }
  });

  fastify.post("/register", async (request, reply) => {
    const { username, password, role } = request.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await fastify.pg.connect();

    try {
      const check = await client.query(
        "SELECT id FROM users WHERE username = $1",
        [username]
      );

      if (check.rows.length > 0) {
        return reply.code(400).send({
          error: "Username già utilizzato",
        });
      }

      const { rows } = await client.query(
        "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *",
        [username, hashedPassword, role]
      );

      return { user: rows[0] };
    } catch (error) {
      reply.code(500).send(error);
    } finally {
      client.release();
    }
  });

  fastify.get("/me", {
    preValidation: [fastify.authenticate],
    handler: async (request, reply) => {
      return { user: request.user };
    },
  });
}

module.exports = routes;

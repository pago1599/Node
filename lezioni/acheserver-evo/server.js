const fastify = require("fastify")({
  logger: true,
});
const fs = require("fs/promises");
const path = require("path");
const fp = require("fastify-plugin");
const { request } = require("http");

fastify.register(require("@fastify/cors"), {
  // cross origin request
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

fastify.register(require("@fastify/postgres"), {
  connectionString:
    "postgres://postgres:postgresmyapp@localhost:5432/restaurant",
});

const userDataPlugin = fp(async function (fastify, options) {
  const dataDir = path.join(__dirname, "data");
  await fs.mkdir(dataDir, {
    recursive: true,
  });

  fastify.decorate("getUserData", async function (userId) {
    const userFilePath = path.join(dataDir, `user_${userId}.json`);
    try {
      const data = await fs.readFile(userFilePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") return null;
      throw error;
    }
  });

  fastify.decorate("saveUserData", async function (userId, data) {
    const userFilePath = path.join(dataDir, `user_${userId}.json`);
    await fs.writeFile(userFilePath, JSON.stringify(data, null, 2));
    return true;
  });
});

fastify.register(userDataPlugin);

fastify.get("/", async (request, reply) => {
  return {
    status: "online",
    message: "Acheserver-Evo operativo!",
    timestamp: new Date().toISOString(),
  };
});

fastify.setNotFoundHandler((request, reply) => {
  reply.code(404).send({
    error: "Not Found",
    message: `Rotta ${request.method} ${request.url} non trovata`,
    timestamp: new Date().toISOString(),
  });
});

fastify.setErrorHandler((error, request, reply) => {
  const statusCode = error.statusCode || 500;

  fastify.log.error(error);

  reply.code(statusCode).send({
    error: statusCode >= 500 ? "Errore del server" : "Errore della richiesta",
    message: error.message || "Si è verificato un errore",
    timestamp: new Date().toISOString(),
  });
});

// metodi HTTP principali: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS

// rotta GET /users che ritorna un array con tutti gli utenti

// rotta GET dinamica /users/:id che ritorna il singolo utente by ID

// rotta POST nuovo utente o update esistente /users/:id

// rotta DEETE /users/:id che timuove l'utente

// registrazione di rotte API con prefisso
fastify.register(
  async function apiRoutes(fastify, options) {
    fastify.get("/users", async (request, reply) => {
      // percorso dati
      const dataDir = path.join(__dirname, "data");
      // files contenuti dentro "data"
      const files = await fs.readdir(dataDir);
      // filtriamo i files prendendo solo quelli che ci servono
      const userFiles = files.filter(
        (file) => file.startsWith("user_") && file.endsWith(".json")
      );
      // predisponiamo l'array di risultati
      const users = [];
      // cicliamo l'array di file per prendere i contenuti e metterli dentro users
      for (const file of userFiles) {
        const data = await fs.readFile(path.join(dataDir, file), "utf-8");
        const user = JSON.parse(data);
        // rimuoviamo il campo password dai risultati
        delete user.password;
        users.push(user);
      }
      return {
        users,
      };
    });

    fastify.post("/users/:id", async (request, reply) => {
      const { id } = request.params; // id passato nell'url
      const newUserData = request.body;
      // verifichaimo che l'id del parametro corrisponda all'id del body
      if (newUserData.id && newUserData !== id) {
        reply.code(400).send({
          error: "Id utente nel body non corrisponde all'id del percorso",
        });
      }

      newUserData.updateAt = new Date().toISOString();
      // usiamo la nostra utility messa con fastify.decorate
      const existingUser = await fastify.getUserData(id);
      if (!existingUser) {
        newUserData.createdAt = newUserData.updateAt;
      }

      await fastify.saveUserData(id, newUserData);
      reply.code(existingUser ? 200 : 201);
      reply.send({
        success: true,
        message: existingUser ? "Utente aggiornato" : "Utente creato",
        user: newUserData,
      });
    });

    fastify.delete("/users/:id", async (request, reply) => {
      const { id } = request.params;
      const userFilePath = path.join(__dirname, "data", `user_${id}.json`); // pathsistema_progetto/data/user_123.json

      try {
        await fs.access(userFilePath);
      } catch (error) {
        if (error.code === "ENOENT") {
          reply.code(404);
          return {
            error: "Utente non trovato",
          };
        }
        throw error;
      }

      await fs.unlink(userFilePath);

      return {
        success: true,
        message: `Utente ${id} eliminato con successo`,
      };
    });

    fastify.get("/clienti", async (request, reply) => {
      try {
        const { rows } = await fastify.pg.query("SELECT * FROM clienti");
        return {
          clienti: rows,
        };
      } catch (error) {
        reply.log.error(err);
        reply.code(500).send({ error: "Errore DB" });
      }
    });

    fastify.get("/clienti/:id", async (request, reply) => {
      const { id } = request.params;
      const { rows } = await fastify.pg.query(
        "SELECT * FROM clienti WHERE id = $1",
        [id]
      );
      return rows[0] || reply.code(404).send({ error: "Cliente non trovato" });
    });

    fastify.post("/clienti", async (request, reply) => {
      const { nome, telefono, email } = request.body;
      const { rows } = await fastify.pg.query(
        "INSERT INTO clienti (nome, telefono, email) VALUES ($1, $2, $3) RETURNING *",
        [nome, telefono, email]
      );
      return rows[0];
    });

    fastify.get("/clienti/search/:q", async (request, reply) => {
      const { q } = request.params;
      const { rows } = await fastify.pg.query(
        "SELECT * FROM clienti WHERE nome LIKE $1 OR email LIKE $1",
        [`%${q}%`]
      );
      return rows;
    });

    fastify.get("/prenotazioni", async (request, reply) => {
      const { rows } = await fastify.pg.query(`
        SELECT p.id, c.nome AS cliente, t.numero AS tavolo, p.data, p.numero_persone, p.note 
        FROM prenotazioni AS p
        JOIN clienti AS c ON c.id = p.cliente_id
        JOIN tavoli AS t ON t.id = p.tavolo_id
        ORDER BY p.data DESC
        `);
      return rows;
    });

    fastify.post("/prenotazioni", async (request, reply) => {
      const { cliente_id, tavolo_id, data, numero_persone, note } =
        request.body;
      const { rows } = await fastify.pg.query(
        `
          INSERT INTO prenotazioni (cliente_id, tavolo_id, data, numero_persone, note) VALUES ($1, $2, $3, $4, $5) RETURNING *
          `,
        [cliente_id, tavolo_id, data, numero_persone, note]
      );
      return rows;
    });

    fastify.get("/ordini", async (request, reply) => {
      const { rows } = await fastify.pg.query(`
        SELECT o.id, o.data, o.stato, t.numero AS tavolo, c.nome AS cameriere
        FROM ordini AS o
        JOIN tavoli AS t on t.id = o.tavolo_id
        JOIN camerieri AS c ON c.id = o.cameriere_id
        ORDER BY o.data DESC
        `);

      for (const row of rows) {
        const { id: ordine_id } = row;
        const { rows: dettagli } = await fastify.pg.query(
          `
          SELECT p.nome, p.prezzo, d.*
          FROM dettagli_ordini AS d
          JOIN piatti AS p ON p.id = d.piatto_id
          WHERE ordine_id = $1
          `,
          [ordine_id]
        );
        row.dettagli = dettagli;
      }
      return rows;
    });
  },
  {
    prefix: "/api",
  }
);

const start = async () => {
  try {
    const PORT = process.env.PORT || 3000;
    const HOST = process.env.HOST || "0.0.0.0";

    await fastify.listen({
      port: PORT,
      host: HOST,
    });
    console.log(
      `Server in ascolto su ${fastify.server.address().address}:${
        fastify.server.address().port
      }`
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

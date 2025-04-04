const fastify = require("fastify")({
  logger: true,
});
const fs = require("fs/promises");
const path = require("path");
const fp = require("fastify-plugin");

fastify.register(require("@fastify/cors"), {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
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
      if (err.code === "ENOENT") return null;
      throw err;
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
          errro: "Id utente nel body non corrisponde all'id del percorso",
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

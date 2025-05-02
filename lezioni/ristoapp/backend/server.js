const fastify = require("fastify")({ logger: true });
const fastifyCors = require("@fastify/cors");
const fastifyPostgres = require("fastify-postgres");
const fastifyJwt = require("fastify-jwt");

fastify.register(fastifyCors),
  {
    origin: true,
  };

fastify.register(fastifyPostgres),
  {
    connectionString: "postgres://postgres:postgresmyapp@localhost:5432/pago",
  };

fastify.register(fastifyJwt, {
  secret: "045a5ece75f7322b555e8ebf263626e6",
});

fastify.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// registriamo le rotte
fastify.register(require("./routes/auth"));
fastify.register(require("./routes/menu"), {
  prefix: "/api/menu",
});
fastify.register(require("./routes/tables"), {
  prefix: "/api/tables",
});

fastify.get("/", async () => {
  return { status: "Server OK" };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();

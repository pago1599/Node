const fp = require("fastify-plugin");

module.exports = fp(async (fastify) => {
  fastify.register(require("fastify-jwt"), {
    secret: "ciao", // questa chiave in produzione deve essere messa su .env (sequenza di caratteri generate in modo casuale)
  });

  fastify.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply
        .code(401)
        .send({ error: "Non sei autenticato o il tuo token è scaduto" });
    }
  });
});

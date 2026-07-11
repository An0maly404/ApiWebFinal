require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express4");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { initDB } = require("./db");

const PORT = 5002;

async function start() {
    const app = express();

    app.get("/health", (req, res) => {
        res.json({ status: "ok", service: "service-b" });
    });

    await initDB();

    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server)
    );

    app.listen(PORT, () => {
        console.log(`Service B running on port ${PORT}`);
        console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
}

start();
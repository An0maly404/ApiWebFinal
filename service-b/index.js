const express = require("express");
const app = express();

app.use(express.json());

const PORT = 5002;

app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "service-b" });
});

app.listen(PORT, () => {
    console.log(`Service B running on port ${PORT}`);
});
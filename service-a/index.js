const express = require("express");
const app = express();

app.use(express.json());

const PORT = 5001;

app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "service-a" });
});

app.listen(PORT, () => {
    console.log(`Service A running on port ${PORT}`);
});
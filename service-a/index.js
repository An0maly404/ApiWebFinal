require("dotenv").config();
const express = require("express");
const connectDB = require("./db");

const app = express();
app.use(express.json());

const PORT = 5001;

app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "service-a" });
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Service A running on port ${PORT}`);
    });
});
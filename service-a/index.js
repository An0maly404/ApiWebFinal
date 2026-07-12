require("dotenv").config();
const express = require("express");
const connectDB = require("./db");

const app = express();
app.use(express.json());

const PORT = 5001;

app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "service-a" });
});

const Trip = require("./models/Trip");

app.post("/trips", async (req, res) => {
    try {
        const { userId, destination, startDate } = req.body;

        const existingTrip = await Trip.findOne({ userId, destination, startDate });
        if (existingTrip) {
            return res.status(409).json({ error: "A trip to this destination on this date already exists for this user." });
        }

        const trip = new Trip(req.body);
        await trip.save();
        res.status(201).json(trip);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/trips/:userId", async (req, res) => {
    try {
        const trips = await Trip.find({ userId: req.params.userId });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/trips/:id", async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ error: "Trip not found" });
        }
        if (trip.userId !== req.headers["x-user-id"]) {
            return res.status(403).json({ error: "Not your trip" });
        }
        await trip.deleteOne();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Service A running on port ${PORT}`);
    });
});
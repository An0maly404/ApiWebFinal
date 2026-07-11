const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    time: { type: String, required: true },
    title: { type: String, required: true },
});

const tripSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    activities: [activitySchema],
});

module.exports = mongoose.model("Trip", tripSchema);
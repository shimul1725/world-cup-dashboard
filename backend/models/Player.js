const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
    name: String,
    team: String,
    role: String,
    goals: Number,
    assist: Number,
    rating: Number,
    photo: String
});

module.exports = mongoose.model("Player", playerSchema);
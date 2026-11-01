const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");

require("dotenv").config();

const Team = require("./models/Team");
const Player = require("./models/Player");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log(error);
  });

// Home
app.get("/", (req, res) => {
  res.send("World Cup API Running");
});

// ================= TEAM API =================

app.get("/test", (req, res) => {
  res.send("Test route working");
});

// Get all teams
app.get("/teams", async (req, res) => {
  const teams = await Team.find();
  res.json(teams);
});

// Add team
app.post("/teams", async (req, res) => {
  const newTeam = new Team({
    name: req.body.name,
    chance: req.body.chance,
    attack: req.body.attack,
    defense: req.body.defense,
    midfield: req.body.midfield
  });

  await newTeam.save();

  res.json({
    message: "Team Added"
  });
});

// ================= PLAYER API =================

// Get all players
app.get("/players", async (req, res) => {
  const players = await Player.find();
  res.json(players);
});

// Add player
app.post("/players", async (req, res) => {
  const player = new Player(req.body);
  await player.save();

  res.json({
    message: "Player Added"
  });
});

// Update player (by ID)
app.put("/players/:id", async (req, res) => {
  try {
    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedPlayer) {
      return res.status(404).json({
        error: "Player not found"
      });
    }

    res.json({
      message: "Player Updated",
      player: updatedPlayer
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message
    });
  }
});

// ================= LIVE WORLD CUP API =================

const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY;
const BASE_URL = "https://api.football-data.org/v4";

// Simple in-memory cache (quota বাঁচানোর জন্য)
let matchesCache = { data: null, timestamp: 0 };
let standingsCache = { data: null, timestamp: 0 };
const CACHE_DURATION = 30000; // 30 সেকেন্ড

// Get live World Cup matches
app.get("/api/worldcup/matches", async (req, res) => {
  const now = Date.now();

  if (matchesCache.data && (now - matchesCache.timestamp < CACHE_DURATION)) {
    return res.json(matchesCache.data);
  }

  try {
    const response = await axios.get(`${BASE_URL}/competitions/WC/matches`, {
      headers: { "X-Auth-Token": FOOTBALL_API_KEY }
    });
    matchesCache = { data: response.data, timestamp: now };
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message
    });
  }
});

// Get World Cup standings
app.get("/api/worldcup/standings", async (req, res) => {
  const now = Date.now();

  if (standingsCache.data && (now - standingsCache.timestamp < CACHE_DURATION)) {
    return res.json(standingsCache.data);
  }

  try {
    const response = await axios.get(`${BASE_URL}/competitions/WC/standings`, {
      headers: { "X-Auth-Token": FOOTBALL_API_KEY }
    });
    standingsCache = { data: response.data, timestamp: now };
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
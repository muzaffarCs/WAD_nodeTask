require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});
const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "test.html"));
});

app.get("/users", function(req, res) {
  User.find().then(function(users) {
    res.json(users);
  }).catch(function(err) {
    res.status(500).json({ error: err.message });
  });
});

app.get("/user/:id", function(req, res) {
  User.findById(req.params.id).then(function(user) {
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  }).catch(function(err) {
    res.status(500).json({ error: err.message });
  });
});

app.post("/user", function(req, res) {
  User.create(req.body).then(function(user) {
    res.status(201).json(user);
  }).catch(function(err) {
    res.status(400).json({ error: err.message });
  });
});

app.put("/user/:id", function(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(function(user) {
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  }).catch(function(err) {
    res.status(400).json({ error: err.message });
  });
});

app.delete("/user/:id", function(req, res) {
  User.findByIdAndDelete(req.params.id).then(function(user) {
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  }).catch(function(err) {
    res.status(500).json({ error: err.message });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("Server running on port " + PORT);
});

module.exports = app;

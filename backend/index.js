const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || "";
if (!mongoUri) {
  console.warn("MONGODB_URI is not set. Backend will start without DB.");
}

mongoose
  .connect(mongoUri, { dbName: process.env.MONGODB_DB || undefined })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// User model
const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, index: true },
    email: { type: String, index: true },
    name: String,
    picture: String,
  },
  { timestamps: true }
);
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Upsert user endpoint
app.post("/api/users/upsert", async (req, res) => {
  try {
    const { googleId, email, name, picture } = req.body || {};
    if (!email && !googleId) {
      return res.status(400).json({ error: "email or googleId required" });
    }

    const filter = googleId ? { googleId } : { email };
    const update = { $set: { email, name, picture, googleId } };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const user = await User.findOneAndUpdate(filter, update, options).lean();
    res.json({ ok: true, user });
  } catch (err) {
    console.error("Upsert user failed:", err);
    res.status(500).json({ error: "server_error" });
  }
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});



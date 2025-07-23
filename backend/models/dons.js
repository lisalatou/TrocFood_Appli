const mongoose = require("mongoose");

const donSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  latitude: Number,
  longitude: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  createdAt: { type: Date, default: Date.now },
});

const Don = mongoose.model("dons", donSchema);
module.exports = Don;

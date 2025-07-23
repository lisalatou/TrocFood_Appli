const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  street: String,
  postalCode: String,
  city: String,
  country: String,
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number], // [longitude, latitude]
  },
});

const userSchema = mongoose.Schema({
  email: String,
  userName: String,
  firstName: String,
  lastName: String,
  password: String,
  token: String,
  picture: String,
  birthday: Date,
  phone: String,
  address: addressSchema,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "dons" }], // liste des dons favoris
  isOnline: { type: Boolean, default: false },
});

const User = mongoose.model("users", userSchema);
module.exports = User;

const mongoose = require("mongoose");

const userRegisterSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true, unique: true },
  userPassword: { type: String },
});

module.exports = mongoose.model("usersregister", userRegisterSchema);

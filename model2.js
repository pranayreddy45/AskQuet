const mongoose = require("mongoose");

const usersPostSchema = new mongoose.Schema({
  userName: { type: String },
  userPostTitle: { type: String },
  userPostContent: { type: String },
  userPostComments: { type: [String] },
  userPostCreate: { type: Date },
});

module.exports = mongoose.model("userspost", usersPostSchema);

const mongoose = require("mongoose");

const usersCommentSchema = new mongoose.Schema({
  userPostId: { type: mongoose.Schema.Types.ObjectId },
  userName: { type: String },
  userComment: { type: String },
  userPostCreate: { type: Date },
});

module.exports = mongoose.model("userscomment", usersCommentSchema);

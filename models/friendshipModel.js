const mongoose = require("mongoose");

const friendshipSchema = new mongoose.Schema({
  userOne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userTwo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

const Friendship = mongoose.model("Friendship", friendshipSchema);
module.exports = Friendship;

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const followSchema = new mongoose.Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
); // `timestamps` añade automáticamente `createdAt` y `updatedAt`

const Follow = mongoose.model("Follow", followSchema);

module.exports = Follow;

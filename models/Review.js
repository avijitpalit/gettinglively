const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userScore: {
      type: Number,
      required: true,
    },
    userComment: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);

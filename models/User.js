const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
    },
    websiteurl: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Active"],
      default: "Pending",
    },
    role: {
      type: String,
      enum: ["customer", "business", "admin"],
      default: "customer",
    },
    emailUpdates: {
      type: String,
      enum: ["in", "out"],
      default: "in",
    },
    confirmationCode: {
      type: String,
      unique: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  var user = this;
  var SALT_FACTOR = 5;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

const User = mongoose.model("User", userSchema);

module.exports = User;

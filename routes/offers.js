const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middlewares/auth");
const User = require("../models/User");
const Offer = require("../models/Offer");
const Voucher = require("../models/Voucher");

// offers page
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const offerbyuser = await Voucher.find({ user: req.user.id })
      .populate("user")
      .populate("offer")
      .populate("post")
      .lean();

    res.render("offers", {
      layout: "layouts/layout",
      offerbyuser,
      helper: require("../helpers/ejs"),
    });
  } catch (error) {
    console.log(error);
    res.render("errors/pagenotfound");
  }
});

module.exports = router;

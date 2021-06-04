const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Post = require("../models/Post");
const Review = require("../models/Review");

const { ensureAdmin, ensureAuthenticated } = require("../middlewares/auth");

router.post(
  "/admin/:id",
  ensureAuthenticated,
  ensureAdmin,
  async (req, res) => {
    try {
      const { userScore, userComment } = req.body;
      //   const post = await Post.find({ id: req.user.id });
      //   const newReview = new Reviews({
      //     userScore: req.body.userScore,
      //     userComment: req.body.userComment,
      //     post: post.id,
      //   });

      //   await newReview.save().then((review) => {
      //     post.books.push(newReview);
      //   });
      //   await post.save();

      await Review.create({
        userScore,
        userComment,
        post: req.params.id,
        user: req.user.id,
      });
      const post = await Post.findById({ _id: req.params.id }).populate(
        "reviews"
      );
      req.flash("success_msg", "Thanks for giving review");
      res.redirect(`/admincreate/myentries/entry/${req.params.id}`);
    } catch (error) {
      console.log(error);
      res.render("errors/500");
    }
  }
);

module.exports = router;

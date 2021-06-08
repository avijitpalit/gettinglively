const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Review = require("../models/Review");
const path = require("path");
const { ensureAuthenticated, ensureBusiness } = require("../middlewares/auth");
const nodemailer = require("nodemailer");

// get business dash
router.get("/", ensureAuthenticated, ensureBusiness, async (req, res) => {
  try {
    const allBusinessEntries = await Post.find({
      user: req.user.id,
      reviewStatus: "reviewed",
    })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("businessmember/businessdash", {
      layout: "layouts/layout",
      allBusinessEntries,
      helper: require("../helpers/ejs"),
    });
  } catch (error) {
    console.log(error);
    res.render("errors/pagenotfound");
  }
});

router.get(
  "/createentries",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      res.render("businessmember/createBusinessEntry", {
        layout: "layouts/layout",
      });
      //   res.render("businessmember/businessdash", {
      //     layout: "layouts/layout",
      //     helper: require("../helpers/ejs"),
      //   });
    } catch (error) {
      console.log(error);
      res.render("errors/pagenotfound");
    }
  }
);

// post entry
router.post(
  "/createentries",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const {
        name,
        desc,
        typeOfPlace,
        typeOfVenue,
        location,

        bookingStatus,
        monopening,
        monclose,
        tueopening,
        tueclose,
        wedopening,
        wedclose,
        thuopening,
        thuclose,
        friopening,
        friclose,
        satopening,
        satclose,
        sunopening,
        sunclose,
      } = req.body;
      const errors = [];

      let cover = req.files.cover;
      cover.mv(path.resolve(__dirname, "..", "public/img", cover.name));
      let image1 = req.files.image1;
      image1.mv(path.resolve(__dirname, "..", "public/img", image1.name));
      let image2 = req.files.image2;
      image2.mv(path.resolve(__dirname, "..", "public/img", image2.name));
      let image3 = req.files.image3;
      image3.mv(path.resolve(__dirname, "..", "public/img", image3.name));
      let image4 = req.files.image4;
      image4.mv(path.resolve(__dirname, "..", "public/img", image4.name));
      let image5 = req.files.image5;
      image5.mv(path.resolve(__dirname, "..", "public/img", image5.name));
      let image6 = req.files.image6;
      image6.mv(path.resolve(__dirname, "..", "public/img", image6.name));
      let image7 = req.files.image7;
      image7.mv(path.resolve(__dirname, "..", "public/img", image7.name));
      let image8 = req.files.image8;
      image8.mv(path.resolve(__dirname, "..", "public/img", image8.name));
      let image9 = req.files.image9;
      image9.mv(path.resolve(__dirname, "..", "public/img", image9.name));
      let menu = req.files.menu;
      menu.mv(path.resolve(__dirname, "..", "public/docs", menu.name));

      if (desc.length < 500) {
        errors.push({ msg: "Description must be atleast 500 characters" });
        //   req.flash("warning_msg", "Description must be atleast 500 characters");
        return res.render("businessmember/createBusinessEntry", {
          layout: "layouts/layout",
          name,
          location,
          desc: desc.replace(/(<([^>]+)>)/gi, ""),
          typeOfVenue,

          monopening,
          monclose,
          tueopening,
          tueclose,
          wedopening,
          wedclose,
          thuopening,
          thuclose,
          friopening,
          friclose,
          satopening,
          satclose,
          sunopening,
          sunclose,
          errors,
        });
      }
      await Post.create({
        name,
        desc,
        typeOfPlace,
        location,
        typeOfVenue,
        bookingStatus,
        monopening,
        monclose,
        tueopening,
        tueclose,
        wedopening,
        wedclose,
        thuopening,
        thuclose,
        friopening,
        friclose,
        satopening,
        satclose,
        sunopening,
        sunclose,
        user: req.user.id,
        cover: "/img/" + cover.name,
        image1: "/img/" + image1.name,
        image2: "/img/" + image2.name,
        image3: "/img/" + image3.name,
        image4: "/img/" + image4.name,
        image5: "/img/" + image5.name,
        image6: "/img/" + image6.name,
        image7: "/img/" + image7.name,
        image8: "/img/" + image8.name,
        image9: "/img/" + image9.name,
        menu: "/docs/" + menu.name,
      }).then((post) => {
        req.flash("upload_msg", "Entry created and sent for verification.");
      });
      var smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "gettinglivelytest@gmail.com",
          pass: "sahilkumar@123",
        },
      });

      var mailOptions = {
        to: req.user.email,
        from: "GettingLively.com",
        subject: "Entry Created",
        text: "Your entry has been created. Please add images and menu to publish your entry.",
        // text: body,
      };
      smtpTransport
        .sendMail(mailOptions)

        .catch((err) => console.log(err));
      res.redirect("/business");
    } catch (error) {
      console.log(error);
      res.render("errors/500");
    }
  }
);

router.get(
  "/reviewentries",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const reviewEntries = await Post.find({
        user: req.user.id,
        reviewStatus: "inprocess",
      })
        .populate("user")

        .sort({ createdAt: "desc" })
        .lean();
      res.render("businessmember/reviewEntries", {
        layout: "layouts/layout",
        reviewEntries,
        helper: require("../helpers/ejs"),
      });
    } catch (error) {
      console.log(error);
      res.render("errors/500");
    }
  }
);

// get single entry
router.get(
  "/myentries/entry/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const entry = await Post.findById({
        _id: req.params.id,
        user: req.user.id,
      })
        .populate("user")
        .lean();
      const allReview = await Review.find({ post: req.params.id })
        .populate("post")
        .populate("user")
        .sort({ createdAt: "desc" })
        .lean();
      let totalScore = 0;
      for (i = 0; i < allReview.length; i++) {
        totalScore = totalScore + allReview[i].userScore;
      }
      if (!entry) {
        res.render("errors/404");
      }
      res.render("businessmember/entryDetailBusiness", {
        layout: "layouts/layout",
        entry,
        allReview,
        totalScore,
        user: req.user,
        helper: require("../helpers/ejs"),
      });
    } catch (error) {
      console.log(error);
      res.render("errors/pagenotfound");
    }
  }
);

// delete business entry
router.delete(
  "/myentries/entry/delete/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      await Post.remove({ _id: req.params.id });
      req.flash("success_msg", "Entry Deleted Successfully!");
      res.redirect("/business");
    } catch (error) {
      console.log(error);
      return res.render("errors/500");
    }
  }
);

// get edit page
router.get(
  "/myentries/entry/edit/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const entry = await Post.findOne({ _id: req.params.id }).lean();
      if (!entry) {
        return res.render("error/404");
      }
      if (entry.user != req.user.id) {
        req.flash("error_msg", "Cannot process request at the moment!");
        res.redirect(`/business/myentries/entry/${req.params.id}`);
      } else {
        res.render("businessmember/editBusinessEntry", {
          layout: "layouts/layout",
          entry,
          user: req.user,
          helper: require("../helpers/ejs"),
        });
      }
    } catch (error) {
      console.log(error);
      res.render("errors/500");
    }
  }
);

// edit entry using method overrride
// /myentries/entry/delete/:id
router.put(
  "/myentries/entry/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const {
        name,
        desc,
        typeOfPlace,
        typeOfVenue,
        location,
        bookingStatus,
        monopening,
        monclose,
        tueopening,
        tueclose,
        wedopening,
        wedclose,
        thuopening,
        thuclose,
        friopening,
        friclose,
        satopening,
        satclose,
        sunopening,
        sunclose,
      } = req.body;
      const errors = [];

      let cover = req.files.cover;
      cover.mv(path.resolve(__dirname, "..", "public/img", cover.name));
      let image1 = req.files.image1;
      image1.mv(path.resolve(__dirname, "..", "public/img", image1.name));
      let image2 = req.files.image2;
      image2.mv(path.resolve(__dirname, "..", "public/img", image2.name));
      let image3 = req.files.image3;
      image3.mv(path.resolve(__dirname, "..", "public/img", image3.name));
      let image4 = req.files.image4;
      image4.mv(path.resolve(__dirname, "..", "public/img", image4.name));
      let image5 = req.files.image5;
      image5.mv(path.resolve(__dirname, "..", "public/img", image5.name));
      let image6 = req.files.image6;
      image6.mv(path.resolve(__dirname, "..", "public/img", image6.name));
      let image7 = req.files.image7;
      image7.mv(path.resolve(__dirname, "..", "public/img", image7.name));
      let image8 = req.files.image8;
      image8.mv(path.resolve(__dirname, "..", "public/img", image8.name));
      let image9 = req.files.image9;
      image9.mv(path.resolve(__dirname, "..", "public/img", image9.name));
      let menu = req.files.menu;
      menu.mv(path.resolve(__dirname, "..", "public/docs", menu.name));

      if (desc.length < 500) {
        errors.push({ msg: "Description must be atleast 500 characters" });
        //   req.flash("warning_msg", "Description must be atleast 500 characters");
        return res.render("businessmember/editBusinessEntry", {
          layout: "layouts/layout",
          errors,
        });
      }
      let entry = await Post.findById(req.params.id).lean();
      if (!entry) {
        return res.render("error/404");
      }
      if (entry.user != req.user.id) {
        req.flash("error_msg", "You can not edit this entry. Try again!");
        res.redirect(`/business/myentries/entry/${req.params.id}`);
      } else {
        entry = await Post.findOneAndUpdate(
          {
            _id: req.params.id,
          },
          {
            name,
            desc,
            typeOfPlace,
            location,
            typeOfVenue,
            bookingStatus,
            monopening,
            monclose,
            tueopening,
            tueclose,
            wedopening,
            wedclose,
            thuopening,
            thuclose,
            friopening,
            friclose,
            satopening,
            satclose,
            sunopening,
            sunclose,
            reviewStatus: "inprocess",
            user: req.user.id,
            cover: "/img/" + cover.name,
            image1: "/img/" + image1.name,
            image2: "/img/" + image2.name,
            image3: "/img/" + image3.name,
            image4: "/img/" + image4.name,
            image5: "/img/" + image5.name,
            image6: "/img/" + image6.name,
            image7: "/img/" + image7.name,
            image8: "/img/" + image8.name,
            image9: "/img/" + image9.name,
            menu: "/docs/" + menu.name,
          },
          {
            new: true,
            runValidators: true,
          }
        );
        entry.reviewStatus = "inprocess";
        entry.save().then((go) => {
          req.flash("success_msg", "Entry edited successfully!");
          res.redirect(`/business/myentries/entry/${req.params.id}`);
        });
      }
    } catch (error) {
      console.log(error);
      return res.render("errors/404");
    }
  }
);

module.exports = router;

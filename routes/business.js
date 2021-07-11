const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Review = require("../models/Review");
const Offer = require("../models/Offer");
const Voucher = require("../models/Voucher");
const path = require("path");
const { paymentsApi, locationsApi } = require("../middlewares/square");
const { v4: uuidv4 } = require("uuid");
const { ensureAuthenticated, ensureBusiness } = require("../middlewares/auth");
const nodemailer = require("nodemailer");
// const { response } = require("express");
const cron = require("node-cron");

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
        city,
        postcode,
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

      if (req.files.menu) {
        let menu = req.files.menu;
        menu.mv(path.resolve(__dirname, "..", "public/docs", menu.name));

        if (desc.length < 300) {
          errors.push({ msg: "Description must be atleast 300 characters" });
          //   req.flash("warning_msg", "Description must be atleast 500 characters");
          return res.render("businessmember/createBusinessEntry", {
            layout: "layouts/layout",
            name,
            location,
            desc: desc.replace(/(<([^>]+)>)/gi, ""),
            typeOfVenue,
            city,
            postcode,
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

        //   payment login will be written here

        await Post.create({
          name,
          desc,
          typeOfPlace,
          location,
          city,
          postcode,
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
            user: process.env.ID,
            pass: process.env.PASS,
          },
        });

        var mailOptions = {
          to: req.user.email,
          from: "GettingLively.com",
          subject: "Entry Created",
          text: "Your entry has been created. Please proceed with payment to make your entry public.",
          // text: body,
        };
        smtpTransport
          .sendMail(mailOptions)

          .catch((err) => console.log(err));
        res.redirect("/business");
      } else {
        if (desc.length < 300) {
          errors.push({ msg: "Description must be atleast 500 characters" });
          //   req.flash("warning_msg", "Description must be atleast 500 characters");
          return res.render("businessmember/createBusinessEntry", {
            layout: "layouts/layout",
            name,
            location,
            desc: desc.replace(/(<([^>]+)>)/gi, ""),
            typeOfVenue,
            postcode,
            city,
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

        //   payment login will be written here

        await Post.create({
          name,
          desc,
          city,
          typeOfPlace,
          location,
          postcode,
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
        }).then((post) => {
          req.flash("success_msg", "Success!");
        });
        var smtpTransport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.ID,
            pass: process.env.PASS,
          },
        });

        var mailOptions = {
          to: req.user.email,
          from: "GettingLively.com",
          subject: "Entry Created",
          text: "Your entry has been created. Please process with payment to make your entry public.",
          // text: body,
        };
        smtpTransport
          .sendMail(mailOptions)

          .catch((err) => console.log(err));
        req.flash(
          "success_msg",
          "Entry created and sent for verification. Please proceed with payment to make your entry public."
        );
        res.redirect("/business");
      }
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
        paymentStatus: "paid",
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
      const allOffers = await Offer.find({
        post: req.params.id,
        offerStatus: "paid",
      })
        .populate("post")
        .populate("user")
        .sort({ createdAt: "desc" })
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
        allOffers,
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
        city,
        postcode,
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

      if (req.files.menu) {
        let menu = req.files.menu;
        menu.mv(path.resolve(__dirname, "..", "public/docs", menu.name));

        if (desc.length < 300) {
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
              postcode,
              city,
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
      } else {
        if (desc.length < 300) {
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
              postcode,
              city,
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
      }
    } catch (error) {
      console.log(error);
      return res.render("errors/404");
    }
  }
);

// post offer
router.post(
  "/createoffer/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const { offername, offeramount, offerdesc } = req.body;
      const entry = await Post.findById({ _id: req.params.id });
      console.log(entry);
      if (entry && entry.user._id.toString() == req.user._id.toString()) {
        await Offer.create({
          offername,
          offerdesc,
          offeramount,
          user: req.user.id,
          post: req.params.id,
        }).then((data) => {
          req.flash("success_msg", "Offer created successfully!");
          //   res.redirect(`/business/myentries/entry/${req.params.id}`);
        });
        await Post.findById({ _id: req.params.id }).then((post) => {
          if (post.reviewStatus == "reviewed") {
            post.reviewStatus = "inprocess";
          }
          post.save((err) => {
            // req.flash("success_msg", "Offer edited successfully");
            res.redirect(`/business/myentries/entry/${req.params.id}`);
          });
        });
      } else {
        req.flash(
          "error_msg",
          "Not allowed to create offer as you are not the owner of this post."
        );
        res.redirect(`/business/myentries/entry/${req.params.id}`);
      }
    } catch (error) {
      console.log(error);
      res.render("errors/500");
    }
  }
);

// delete
// delete business entry
router.delete(
  "/myentries/offer/delete/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      let offer = await Offer.findById(req.params.id).populate("post").lean();
      await Offer.remove({ _id: req.params.id });
      req.flash("success_msg", "Offer Deleted Successfully!");
      res.redirect(`/business/myentries/entry/${offer.post._id}`);
    } catch (error) {
      console.log(error);
      return res.render("errors/500");
    }
  }
);

// get offer edit page
router.get(
  "/myentries/offer/edit/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const offer = await Offer.findOne({ _id: req.params.id })
        .populate("post")
        .lean();
      if (!offer) {
        return res.render("error/404");
      }
      if (offer.user != req.user.id) {
        req.flash("error_msg", "Cannot process request at the moment!");
        res.redirect(`/business/myentries/entry/${offer.post._id}`);
      } else {
        res.render("businessmember/offeredit", {
          layout: "layouts/layout",
          offer,
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

// edit offer
router.put(
  "/createoffer/edit/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const { offername, offerdesc, offeramount } = req.body;
      if (!offerdesc) {
        req.flash("error_msg", "Please enter description");
        return res.redirect(`/business/myentries/offer/edit/${req.params.id}`);
      }
      let offer = await Offer.findById(req.params.id).populate("post").lean();
      if (!offer) {
        return res.render("error/404");
      }

      if (offer.user != req.user.id) {
        req.flash("error_msg", "You can not edit this offer. Try again!");
        res.redirect(`/business/myentries/entry/${offer.post._id}`);
      } else {
        offer = await Offer.findOneAndUpdate(
          {
            _id: req.params.id,
          },
          {
            offername,
            offerdesc,
            offeramount,
          },
          {
            new: true,
            runValidators: true,
          }
        );
        await Post.findById({ _id: offer.post }).then((post) => {
          if (post.reviewStatus == "reviewed") {
            post.reviewStatus = "inprocess";
          }
          post.save((err) => {
            offer.save().then((go) => {
              req.flash("success_msg", "Offer edited successfully");
              res.redirect(`/business/myentries/entry/${offer.post._id}`);
            });
          });
        });
      }
    } catch (error) {
      console.log(error);
      res.render("errors/500");
    }
  }
);

router.get(
  "/entries/pendingpayment",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const pendingEntries = await Post.find({
        paymentStatus: "pending",
        user: req.user.id,
      })
        .sort({ createdAt: "desc" })
        .lean();

      const pendingOffers = await Offer.find({
        offerStatus: "pending",
        user: req.user.id,
      }).lean();
      res.render("businessmember/pendingPayment", {
        layout: "layouts/layout",
        pendingEntries,
        pendingOffers,
        helper: require("../helpers/ejs"),
      });
    } catch (error) {
      console.log(error);
      res.render("errors/500");
    }
  }
);

router.get(
  "/entries/paymentpage/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const entry = await Post.findById({ _id: req.params.id })
        .populate("user")
        .lean();
      const amount = 1;
      if (entry) {
        res.render("businessmember/payment", {
          entry,
          amount,
          layout: "layouts/layout",
          user: req.user,
          helper: require("../helpers/ejs"),
        });
      }
    } catch (error) {
      console.log(error);
      res.render("errors/pagenotfound");
    }
  }
);

// get offer payment page
router.get(
  "/offers/paymentpage/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const offer = await Offer.findById({ _id: req.params.id })
        .populate("user")
        .lean();
      const amount = 1;
      if (offer) {
        res.render("businessmember/paymentOffer", {
          offer,
          amount,
          layout: "layouts/layout",
          user: req.user,
          helper: require("../helpers/ejs"),
        });
      } else {
        res.render("errors/404");
      }
    } catch (error) {
      console.log(error);
      res.render("errors/500");
    }
  }
);

// post method of payment of offer
router.post(
  "/offers/paymentpage/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const verifyPayment = await Offer.findById({ _id: req.params.id })
        .populate("user")
        .lean();

      if (verifyPayment.offerStatus == "pending") {
        const token = req.body.sourceId;
        const idempotencyKey = uuidv4();
        // get the currency for the location
        const locationResponse = await locationsApi.retrieveLocation(
          process.env.SQUARE_LOCATION_ID
        );
        const currency = locationResponse.result.location.currency;
        // Charge the customer's card
        const requestBody = {
          idempotencyKey,
          sourceId: token,
          amountMoney: {
            amount: 100, // $1.00 charge
            currency,
          },
        };
        try {
          const {
            result: { payment },
          } = await paymentsApi.createPayment(requestBody);

          const result = JSON.stringify(
            payment,
            (key, value) => {
              return typeof value === "bigint" ? parseInt(value) : value;
            },
            4
          );

          if (result) {
            console.log(result);
            await Offer.findById({ _id: req.params.id }).then((offer) => {
              if (offer.offerStatus == "pending") {
                offer.offerStatus = "paid";
                offer.offerId = payment.orderId;
                offer.offerCreationCardBrand =
                  payment.cardDetails.card.cardBrand;
                offer.offerCreationCardLast4 = payment.cardDetails.card.last4;
                offer.offerCreationCardExpMon =
                  payment.cardDetails.card.expMonth;
                offer.offerCreationCardExpYear =
                  payment.cardDetails.card.expYear;
                offer.offerCreationCardType = payment.cardDetails.card.cardType;
                offer.offerpaymentCreationDate = payment.createdAt;
              }
              offer.save((err) => {
                req.flash(
                  "success_msg",
                  "Payment successfull. Offer sent for review. You may now close this browser window."
                );
                res.redirect(req.originalUrl);
              });
            });
          } else {
            req.flash("error_msg", "Payment Failed. Try again");
            res.redirect(req.originalUrl);
          }
        } catch (error) {
          console.log(error);
          req.flash("error_msg", "Payment Failed. Try again");
          res.redirect(req.originalUrl);
        }
      } else {
        req.flash("error_msg", "Offer Already Activated!");

        res.redirect("/business/entries/pendingpayment");
      }
    } catch (error) {
      console.log(error);
      res.render("errors/500");
    }
  }
);

router.post(
  "/entries/paymentpage/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const verifyPayment = await Post.findById({ _id: req.params.id })
        .populate("user")
        .lean();

      if (verifyPayment.paymentStatus == "pending") {
        const token = req.body.sourceId;
        const idempotencyKey = uuidv4();
        // get the currency for the location
        const locationResponse = await locationsApi.retrieveLocation(
          process.env.SQUARE_LOCATION_ID
        );
        const currency = locationResponse.result.location.currency;
        // Charge the customer's card
        const requestBody = {
          idempotencyKey,
          sourceId: token,
          amountMoney: {
            amount: 100, // $1.00 charge
            currency,
          },
        };
        try {
          const {
            result: { payment },
          } = await paymentsApi.createPayment(requestBody);

          const result = JSON.stringify(
            payment,
            (key, value) => {
              return typeof value === "bigint" ? parseInt(value) : value;
            },
            4
          );

          if (result) {
            console.log(payment);
            await Post.findById({ _id: req.params.id }).then((post) => {
              if (post.paymentStatus == "pending") {
                post.paymentStatus = "paid";
                post.entryId = payment.orderId;
                post.entryCreationCardBrand =
                  payment.cardDetails.card.cardBrand;
                post.entryCreationCardLast4 = payment.cardDetails.card.last4;
                post.entryCreationCardExpMon =
                  payment.cardDetails.card.expMonth;
                post.entryCreationCardExpYear =
                  payment.cardDetails.card.expYear;
                post.entryCreationCardType = payment.cardDetails.card.cardType;
                post.entrypaymentCreationDate = payment.createdAt;
              }
              post.save((err) => {
                req.flash(
                  "success_msg",
                  "Payment successfull. Entry sent for review. You may now close this browser window."
                );
                res.redirect(req.originalUrl);
              });
            });
          } else {
            req.flash("error_msg", "Payment Failed. Try again");
            res.redirect(req.originalUrl);
          }
        } catch (error) {
          console.log(error);
          req.flash("error_msg", "Payment Failed. Try again");
          res.redirect(req.originalUrl);
        }
      } else {
        req.flash("error_msg", "Already paid!");

        res.redirect("/business/entries/pendingpayment");
      }
    } catch (error) {
      console.log(error);
      res.render("errors/500");
    }
  }
);

// get manage listing page
//
router.get(
  "/managelisting",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const allBusinessEntries = await Post.find({
        user: req.user.id,
        reviewStatus: "reviewed",
      })
        .populate("user")
        .sort({ createdAt: "desc" })
        .lean();

      const allVouchers = await Voucher.find({})
        .populate("post")
        .populate("user")
        .populate("offer")
        .sort({ createdAt: "desc" })
        .lean();

      res.render("businessmember/managelisting", {
        layout: "layouts/layout",
        allBusinessEntries,
        allVouchers,
        user: req.user,
        helper: require("../helpers/ejs"),
      });
    } catch (error) {
      console.log(error);
      res.render("errors/pagenotfound");
    }
  }
);

// get pricing and plans page
router.get(
  "/pricingandplans/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const entry = await Post.findById({ _id: req.params.id })
        .populate("user")
        .lean();
      const amount_premier = 50;
      const amount_advancedpremier = 100;
      const amount_promoted = 200;
      if (entry) {
        res.render("businessmember/pricingplans", {
          entry,
          amount_premier,
          amount_advancedpremier,
          amount_promoted,
          layout: "layouts/layout",
          user: req.user,
          helper: require("../helpers/ejs"),
        });
      }
    } catch (error) {
      console.log(error);
      res.render("errors/pagenotfound");
    }
  }
);

// get premier plan payment
router.get(
  "/pricingandplans/premier/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const entry = await Post.findById({ _id: req.params.id })
        .populate("user")
        .lean();
      const amount = 50;
      if (entry) {
        res.render("businessmember/paymentlisting", {
          entry,
          amount,
          layout: "layouts/layout",
          user: req.user,
          helper: require("../helpers/ejs"),
        });
      } else {
        res.render("errors/pagenotfound");
      }
    } catch (error) {
      console.log(error);
      res.render("errors/pagenotfound");
    }
  }
);

// post method payment of premier plan
router.post(
  "/pricingandplans/premier/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const entry = await Post.findById({ _id: req.params.id })
        .populate("user")
        .lean();
      if (entry.listing == "basic" || entry.listing == "renew") {
        const token = req.body.sourceId;
        const idempotencyKey = uuidv4();
        // get the currency for the location
        const locationResponse = await locationsApi.retrieveLocation(
          process.env.SQUARE_LOCATION_ID
        );
        const currency = locationResponse.result.location.currency;
        // Charge the customer's card
        const requestBody = {
          idempotencyKey,
          sourceId: token,
          amountMoney: {
            amount: 5000,
            currency,
          },
        };
        try {
          const {
            result: { payment },
          } = await paymentsApi.createPayment(requestBody);

          const result = JSON.stringify(
            payment,
            (key, value) => {
              return typeof value === "bigint" ? parseInt(value) : value;
            },
            4
          );

          if (result) {
            console.log(result);
            await Post.findById({ _id: req.params.id }).then((post) => {
              if (post.listing == "basic" || post.listing == "renew") {
                post.listing = "premier";
                post.planId = payment.orderId;
                post.planCreationCardBrand = payment.cardDetails.card.cardBrand;
                post.planCreationCardLast4 = payment.cardDetails.card.last4;
                post.planCreationCardExpMon = payment.cardDetails.card.expMonth;
                post.planCreationCardExpYear = payment.cardDetails.card.expYear;
                post.planCreationCardType = payment.cardDetails.card.cardType;
                post.planpaymentCreationDate = payment.createdAt;
              }
              post.save((err) => {
                req.flash(
                  "success_msg",
                  "Payment successfull. You have successfully bought out premier plan of 1 week validity."
                );
                //   post.planStart = Date.now();
                //   post.planEnd = post.planStart + 20000;
                //   post.save();
                //   cron.schedule("* * * * * *", async function (req, res, next) {
                //     let current_date = Date.now();
                //     if (current_date == post.planEnd) {
                //       post.listing = "basic";
                //       post.planStart = undefined;
                //       post.planEnd = undefined;
                //       post.save((err) => {
                //         console.log("Expired");
                //       });
                //     }
                //   });

                setTimeout(() => {
                  post.listing = "renew";
                  post.save();
                  var smtpTransport = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                      user: process.env.ID,
                      pass: process.env.PASS,
                    },
                  });

                  var mailOptions = {
                    to: req.user.email,
                    from: "GettingLively.com",
                    subject: "Renew your plan",
                    text: "Your current promotion plan has been expired. Visit our website to renew the plan or buy another.",
                    // text: body,
                  };
                  smtpTransport
                    .sendMail(mailOptions)

                    .catch((err) => console.log(err));

                  console.log("done");
                }, 604800000);
                res.redirect(req.originalUrl);
              });
            });
          } else {
            console.log("error 1");
            req.flash("error_msg", "Payment Failed. Try again");
            res.redirect(req.originalUrl);
          }
        } catch (error) {
          console.log(error);
          console.log("error 2");
          req.flash("error_msg", "Payment Failed. Try again");
          res.redirect(req.originalUrl);
        }
      } else {
        req.flash("error_msg", "You've already purchased this plan.");
        res.redirect(req.originalUrl);
      }
    } catch (error) {
      console.log(error);
      res.render("errors/500");
    }
  }
);

// get advancepremier plan payment
router.get(
  "/pricingandplans/advancepremier/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const entry = await Post.findById({ _id: req.params.id })
        .populate("user")
        .lean();
      const amount = 100;
      if (entry) {
        res.render("businessmember/paymentlistingadvance", {
          entry,
          amount,
          layout: "layouts/layout",
          user: req.user,
          helper: require("../helpers/ejs"),
        });
      } else {
        res.render("errors/pagenotfound");
      }
    } catch (error) {
      console.log(error);
      res.render("errors/pagenotfound");
    }
  }
);

// post advance plan

router.post(
  "/pricingandplans/advancepremier/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const entry = await Post.findById({ _id: req.params.id })
        .populate("user")
        .lean();
      if (entry.listing == "basic" || entry.listing == "renew") {
        const token = req.body.sourceId;
        const idempotencyKey = uuidv4();
        // get the currency for the location
        const locationResponse = await locationsApi.retrieveLocation(
          process.env.SQUARE_LOCATION_ID
        );
        const currency = locationResponse.result.location.currency;
        // Charge the customer's card
        const requestBody = {
          idempotencyKey,
          sourceId: token,
          amountMoney: {
            amount: 10000, // $1.00 charge
            currency,
          },
        };
        try {
          const {
            result: { payment },
          } = await paymentsApi.createPayment(requestBody);

          const result = JSON.stringify(
            payment,
            (key, value) => {
              return typeof value === "bigint" ? parseInt(value) : value;
            },
            4
          );

          if (result) {
            console.log(result);
            await Post.findById({ _id: req.params.id }).then((post) => {
              if (post.listing == "basic" || post.listing == "renew") {
                post.listing = "premier advance";
                post.planId = payment.orderId;
                post.planCreationCardBrand = payment.cardDetails.card.cardBrand;
                post.planCreationCardLast4 = payment.cardDetails.card.last4;
                post.planCreationCardExpMon = payment.cardDetails.card.expMonth;
                post.planCreationCardExpYear = payment.cardDetails.card.expYear;
                post.planCreationCardType = payment.cardDetails.card.cardType;
                post.planpaymentCreationDate = payment.createdAt;
              }
              post.save((err) => {
                req.flash(
                  "success_msg",
                  "Payment successfull. You have successfully bought out advance premier plan of 1 week validity."
                );
                //   post.planStart = Date.now();
                //   post.planEnd = post.planStart + 20000;
                //   post.save();
                //   cron.schedule("* * * * * *", async function (req, res, next) {
                //     let current_date = Date.now();
                //     if (current_date == post.planEnd) {
                //       post.listing = "basic";
                //       post.planStart = undefined;
                //       post.planEnd = undefined;
                //       post.save((err) => {
                //         console.log("Expired");
                //       });
                //     }
                //   });

                setTimeout(() => {
                  post.listing = "renew";
                  post.save();
                  var smtpTransport = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                      user: process.env.ID,
                      pass: process.env.PASS,
                    },
                  });

                  var mailOptions = {
                    to: req.user.email,
                    from: "GettingLively.com",
                    subject: "Renew your plan",
                    text: "Your current promotion plan has been expired. Visit our website to renew the plan or buy another.",
                    // text: body,
                  };
                  smtpTransport
                    .sendMail(mailOptions)

                    .catch((err) => console.log(err));
                  console.log("done");
                }, 604800000);

                res.redirect(req.originalUrl);
              });
            });
          } else {
            console.log("error 1");
            req.flash("error_msg", "Payment Failed. Try again");
            res.redirect(req.originalUrl);
          }
        } catch (error) {
          console.log(error);
          console.log("error 2");
          req.flash("error_msg", "Payment Failed. Try again");
          res.redirect(req.originalUrl);
        }
      } else {
        req.flash("error_msg", "You've already purchased this plan.");
        res.redirect(req.originalUrl);
      }
    } catch (error) {
      console.log(error);
      res.render("errors/500");
    }
  }
);

// get promoted plan payment
router.get(
  "/pricingandplans/promoted/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const entry = await Post.findById({ _id: req.params.id })
        .populate("user")
        .lean();
      const amount = 200;
      if (entry) {
        res.render("businessmember/paymentlistingpromoted", {
          entry,
          amount,
          layout: "layouts/layout",
          user: req.user,
          helper: require("../helpers/ejs"),
        });
      } else {
        res.render("errors/pagenotfound");
      }
    } catch (error) {
      console.log(error);
      res.render("errors/pagenotfound");
    }
  }
);

// payment promoted
router.post(
  "/pricingandplans/promoted/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const entry = await Post.findById({ _id: req.params.id })
        .populate("user")
        .lean();
      if (entry.listing == "basic" || entry.listing == "renew") {
        const token = req.body.sourceId;
        const idempotencyKey = uuidv4();
        // get the currency for the location
        const locationResponse = await locationsApi.retrieveLocation(
          process.env.SQUARE_LOCATION_ID
        );
        const currency = locationResponse.result.location.currency;
        // Charge the customer's card
        const requestBody = {
          idempotencyKey,
          sourceId: token,
          amountMoney: {
            amount: 20000, // $1.00 charge
            currency,
          },
        };
        try {
          const {
            result: { payment },
          } = await paymentsApi.createPayment(requestBody);

          const result = JSON.stringify(
            payment,
            (key, value) => {
              return typeof value === "bigint" ? parseInt(value) : value;
            },
            4
          );

          if (result) {
            console.log(result);
            await Post.findById({ _id: req.params.id }).then((post) => {
              if (post.listing == "basic" || post.listing == "renew") {
                post.listing = "promoted";
                post.planId = payment.orderId;
                post.planCreationCardBrand = payment.cardDetails.card.cardBrand;
                post.planCreationCardLast4 = payment.cardDetails.card.last4;
                post.planCreationCardExpMon = payment.cardDetails.card.expMonth;
                post.planCreationCardExpYear = payment.cardDetails.card.expYear;
                post.planCreationCardType = payment.cardDetails.card.cardType;
                post.planpaymentCreationDate = payment.createdAt;
              }
              post.save((err) => {
                req.flash(
                  "success_msg",
                  "Payment successfull. You have successfully bought out promoted premier plan of 1 week validity."
                );
                //   post.planStart = Date.now();
                //   post.planEnd = post.planStart + 20000;
                //   post.save();
                //   cron.schedule("* * * * * *", async function (req, res, next) {
                //     let current_date = Date.now();
                //     if (current_date == post.planEnd) {
                //       post.listing = "basic";
                //       post.planStart = undefined;
                //       post.planEnd = undefined;
                //       post.save((err) => {
                //         console.log("Expired");
                //       });
                //     }
                //   });

                setTimeout(() => {
                  post.listing = "renew";
                  post.save();
                  var smtpTransport = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                      user: process.env.ID,
                      pass: process.env.PASS,
                    },
                  });

                  var mailOptions = {
                    to: req.user.email,
                    from: "GettingLively.com",
                    subject: "Renew your plan",
                    text: "Your current promotion plan has been expired. Visit our website to renew the plan or buy another.",
                    // text: body,
                  };
                  smtpTransport
                    .sendMail(mailOptions)

                    .catch((err) => console.log(err));
                  console.log("done");
                }, 604800000);

                res.redirect(req.originalUrl);
              });
            });
          } else {
            console.log("error 1");
            req.flash("error_msg", "Payment Failed. Try again");
            res.redirect(`/business/pricingandplans/${req.params.id}`);
          }
        } catch (error) {
          console.log(error);
          console.log("error 2");
          req.flash("error_msg", "Payment Failed. Try again");
          res.redirect(req.originalUrl);
        }
      } else {
        req.flash("error_msg", "You've already purchased this plan.");
        res.redirect(req.originalUrl);
      }
    } catch (error) {
      console.log(error);
      res.render("errors/500");
    }
  }
);

router.get(
  "/mypayments",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const entryPayments = await Post.find({
        user: req.user.id,
        paymentStatus: "paid",
      }).lean();
      //   const planPaymentPremier = await Post.find({
      //     user: req.user.id,
      //     listing: "premier",
      //   }).lean();
      //   const planPaymentAdvance = await Post.find({
      //     user: req.user.id,
      //     listing: "premier advance",
      //   }).lean();
      //   const planPaymentPromoted = await Post.find({
      //     user: req.user.id,
      //     listing: "",
      //   }).lean();
      //   console.log(planPaymentPromoted.length);
      const offerPayments = await Offer.find({
        user: req.user.id,
        offerStatus: "paid",
      }).lean();
      res.render("businessmember/mypayments", {
        layout: "layouts/layout",
        entryPayments,
        offerPayments,
        // planPaymentPremier,
        // planPaymentAdvance,
        // planPaymentPromoted,
        helper: require("../helpers/ejs"),
        user: req.user,
      });
    } catch (error) {
      console.log(error);
      res.render("errors/pagenotfound");
    }
  }
);

router.get(
  "/mypayments/carddetails/entry/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const entryPayment = await Post.findById({
        _id: req.params.id,
      }).lean();
      //   console.log(entryPayment.length);
      //   const planPaymentPremier = await Post.find({
      //     user: req.user.id,
      //     listing: "premier",
      //   });
      //   const planPaymentAdvance = await Post.find({
      //     user: req.user.id,
      //     listing: "premier advance",
      //   });
      //   const planPaymentPromoted = await Post.find({
      //     user: req.user.id,
      //     listing: "promoted",
      //   });
      //   const offerPayments = await Offer.findById({
      //     _id: req.params.id,
      //   });
      res.render("businessmember/carddetailsEntry", {
        layout: "layouts/layout",
        entryPayment,
        // offerPayments,
        // offerPayments,
        // planPaymentPremier,
        // planPaymentAdvance,
        // planPaymentPromoted,
        helper: require("../helpers/ejs"),
        user: req.user,
      });
    } catch (error) {
      console.log(error);
      res.render("errors/pagenotfound");
    }
  }
);

router.get(
  "/mypayments/carddetails/offer/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const offerPayment = await Offer.findById({
        _id: req.params.id,
      }).lean();
      //   console.log(entryPayment.length);
      //   const planPaymentPremier = await Post.find({
      //     user: req.user.id,
      //     listing: "premier",
      //   });
      //   const planPaymentAdvance = await Post.find({
      //     user: req.user.id,
      //     listing: "premier advance",
      //   });
      //   const planPaymentPromoted = await Post.find({
      //     user: req.user.id,
      //     listing: "promoted",
      //   });
      // const offerPayments = await Offer.findById({
      //   _id: req.params.id,
      // });
      res.render("businessmember/carddetailsOffer", {
        layout: "layouts/layout",
        offerPayment,
        //   offerPayments,
        // offerPayments,
        // planPaymentPremier,
        // planPaymentAdvance,
        // planPaymentPromoted,
        helper: require("../helpers/ejs"),
        user: req.user,
      });
    } catch (error) {
      console.log(error);
      res.render("errors/pagenotfound");
    }
  }
);

router.get(
  "/mypayments/carddetails/plan/:id",
  ensureAuthenticated,
  ensureBusiness,
  async (req, res) => {
    try {
      const entryPayment = await Post.findById({
        _id: req.params.id,
      }).lean();
      //   console.log(entryPayment.length);
      //   const planPaymentPremier = await Post.find({
      //     user: req.user.id,
      //     listing: "premier",
      //   });
      //   const planPaymentAdvance = await Post.find({
      //     user: req.user.id,
      //     listing: "premier advance",
      //   });
      //   const planPaymentPromoted = await Post.find({
      //     user: req.user.id,
      //     listing: "promoted",
      //   });
      const offerPayments = await Offer.findById({
        _id: req.params.id,
      });
      res.render("businessmember/carddetailsEntry", {
        layout: "layouts/layout",
        entryPayment,
        offerPayments,
        // offerPayments,
        // planPaymentPremier,
        // planPaymentAdvance,
        // planPaymentPromoted,
        helper: require("../helpers/ejs"),
        user: req.user,
      });
    } catch (error) {
      console.log(error);
      res.render("errors/pagenotfound");
    }
  }
);

module.exports = router;

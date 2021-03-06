const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    detailTitle: {
      type: String,
    },
    detailDesc: {
      type: String,
    },
    detailPresent: {
      type: String,
      default: "no",
      enum: ["no", "yes"],
    },
    // listing: {
    //   type: String,
    //   enum: ["basic", "premier", "premier advance", "promoted", "renew"],
    //   default: "basic",
    // },
    premier: {
      type: String,
    },
    advance: {
      type: String,
    },

    promoted: {
      type: String,
    },
    userReview: {
      type: String,
    },
    userComment: {
      type: String,
    },
    bookingStatus: {
      type: String,
      default: "Not taking bookings",
      enum: ["Taking bookings", "Not taking bookings"],
    },
    typeOfPlace: {
      type: String,
      default: "none",
      enum: ["restaurant", "bar", "club", "pub", "venue", "none"],
    },
    reviewStatus: {
      type: String,
      enum: ["inprocess", "reviewed"],
      default: "inprocess",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    typeOfVenue: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    location: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postcode: {
      type: String,
      required: true,
    },
    shortPost: {
      type: String,
    },
    lat: Number,
    long: Number,
    nearCodes: {
      type: String,
    },
    planStart: Date,
    planEnd: Date,
    monopening: { type: String },
    monclose: { type: String },
    tueopening: { type: String },
    tueclose: { type: String },
    wedopening: { type: String },
    wedclose: { type: String },
    thuopening: { type: String },
    thuclose: { type: String },
    friopening: { type: String },
    friclose: { type: String },
    satopening: { type: String },
    satclose: { type: String },
    sunopening: { type: String },
    sunclose: { type: String },
    cover: String,
    image1: String,
    image2: String,
    image3: String,
    image4: String,
    image5: String,
    image6: String,
    image7: String,
    image8: String,
    image9: String,

    menu: String,
    entrypaymentCreationDate: Date,
    entryCreationCardBrand: String,
    entryCreationCardLast4: String,
    entryCreationCardExpMon: String,
    entryCreationCardExpYear: String,
    entryCreationCardType: String,
    entryId: String,
    premierplanpaymentCreationDate: {
      type: Date,
    },
    premierplanCreationCardBrand: String,
    premierplanId: String,
    premierplanCreationCardLast4: String,
    premierplanCreationCardExpMon: String,
    premierplanCreationCardExpYear: String,
    premierplanCreationCardType: String,
    advanceplanpaymentCreationDate: {
      type: Date,
    },
    advanceplanCreationCardBrand: String,
    advanceplanId: String,
    advanceplanCreationCardLast4: String,
    advanceplanCreationCardExpMon: String,
    advanceplanCreationCardExpYear: String,
    advanceplanCreationCardType: String,
    type: Date,
    promotedplanpaymentCreationDate: { type: Date },
    promotedplanId: String,
    promotedplanCreationCardBrand: String,
    promotedplanCreationCardLast4: String,
    promotedplanCreationCardExpMon: String,
    promotedplanCreationCardExpYear: String,
    promotedplanCreationCardType: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);


const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


// Index Route
router.get("/", wrapAsync(ListingController.index));

// New Route
router.get("/new", isLoggedIn, ListingController.renderNewForm);

// Show Route
router.get("/:id", wrapAsync(ListingController.showListing));


// Create Route
router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(ListingController.createListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));


// Update Route
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(ListingController.updateListing));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing));

module.exports = router;
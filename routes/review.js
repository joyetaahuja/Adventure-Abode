const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/reviews.js");

// Post route for adding review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//delete route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;


const express = require('express');
const reviewsRouter = express.Router();
const { createReview, getAllReviews, getReviewById, getReviewByProductId, destroyReview } = require('../db/reviews');
const { requireUser } = require("./utils");

reviewsRouter.get('/', async (req, res, next) => {

  try {

    const reviews = await getAllReviews();
    res.send(reviews)

  } catch (error) {
    next(error)
  }
});

reviewsRouter.get("/:productId", async (req, res, next) => {

  const { productId } = req.params

  try {

    const review = await getReviewByProductId(productId)
    res.send(review)

  } catch (error) {

    res.send({
      error: "error",
      message: "Requested review was not found",
      name: "ReviewNotFoundError"
    })
  }
})

reviewsRouter.post("/", requireUser, async (req, res, next) => {

  const { name, description, rating, productId } = req.body;
  const review = {};

  try {

    review.name = name;
    review.description = description;
    review.rating = rating;
    review.productId = productId;
    review.userId = req.user.id;

    const newReview = await createReview(review);

    res.send(newReview);

  } catch (error) {
    throw (error)
  }
});

reviewsRouter.delete("/:id", requireUser, async (req, res, next) => {

  try {

    const review = await getReviewById(req.params.id)

    if (review && review.userId === req.user.id) {

      const deletedReview = await destroyReview(req.params.id);
      res.send(deletedReview);

    } else {

      next(review ? {
        name: "UnauthorizedUserError",
        message: "You cannot delete a review which is not yours"
      } : {
        name: "PostNotFoundError",
        message: "That review does not exist"
      });
    }

  } catch (error) {

    res.send({
      name: "Delete Product",
      message: "Failure to delete product",
      error
    })
  }
})

module.exports = reviewsRouter;
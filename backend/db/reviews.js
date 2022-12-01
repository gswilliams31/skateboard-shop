const client = require('./index');

async function createReview({ name, description, rating, productId, userId }) {

  try {
    const { rows: [review] } = await client.query(`
        INSERT INTO reviews (name, description, rating, "productId", "userId")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `, [name, description, rating, productId, userId])

    return review
  } catch (error) {
    throw error
  }
}

async function getReviewById(id) {

  try {
    const { rows: [review] } = await client.query(`
        SELECT *
        FROM reviews
        WHERE id=$1;  
      `, [id]);

    if (!review) {
      throw {
        error: "error",
        name: "Review Not Found",
        message: "The requested review was not found"
      }
    };

    return review
  } catch (error) {
    throw error;
  }
}

async function getReviewByProductId(productId) {

  try {
    const { rows: [review] } = await client.query(`
        SELECT *
        FROM reviews
        WHERE "productId"=$1;  
      `, [productId]);

    if (!review) {
      throw {
        error: "error",
        name: "Review Not Found",
        message: "The requested review was not found"
      }
    };

    return review
  } catch (error) {
    throw error;
  }
}

async function getReviewByUserId(userId) {

  try {
    const { rows: [review] } = await client.query(`
        SELECT *
        FROM reviews
        WHERE "userId"=$1;  
      `, [userId]);

    if (!review) {
      throw {
        error: "error",
        name: "Review Not Found",
        message: "The requested review was not found"
      }
    };

    return review
  } catch (error) {
    throw error;
  }
}

async function getAllReviews() {

  try {
    const { rows: reviewID } = await client.query(`
        SELECT id
        FROM reviews; 
      `);

    const reviews = await Promise.all(reviewID.map(
      review => getReviewById(review.id)
    ));

    return reviews;
  } catch (error) {
    throw error
  }
}

async function destroyReview(id) {

  try {
    const { rows } = await client.query(`
      DELETE from reviews
      WHERE reviews.id=$1
      RETURNING *;
    `, [id]);

    return rows;
  } catch (error) {
    throw error
  }
}


module.exports = {
  createReview,
  getReviewById,
  getReviewByProductId,
  getReviewByUserId,
  getAllReviews,
  destroyReview
}
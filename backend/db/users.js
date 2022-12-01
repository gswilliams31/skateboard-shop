const client = require('./index');
const bcrypt = require('bcrypt');

async function createUser({ username, password, birthday, admin }) {

  try {
    const SALT_COUNT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
    const { rows: [user] } = await client.query(`
        INSERT INTO users(username, password, birthday, admin)
        VALUES($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING
        RETURNING id, username, birthday, admin;
        `, [username, hashedPassword, birthday, admin])

    return user;
  } catch (error) {
    throw error
  }
}

async function addToCart(productId) {

  try {
    await client.query(`
        INSERT INTO users(cart)
        VALUES ($1)
        ON CONFLICT (cart) DO NOTHING
        `, [productId])

  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {

  try {
    const { rows: [user] } = await client.query(`
        SELECT id, username, admin
        FROM users
        WHERE id=${userId}`);

    if (!user) {
      return null
    }

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {

  try {
    const { rows: [user] } = await client.query(`
        SELECT *
        FROM users
        WHERE username=$1;`, [username]);

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = { createUser, addToCart, getUserById, getUserByUsername }
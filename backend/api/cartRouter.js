const express = require('express');
const cartRouter = express.Router();
const { createCart, getCartByUserId, updateCart, destroyCart } = require('../db/cart');
const { requireUser } = require("./utils");

cartRouter.get("/:userId", requireUser, async (req, res, next) => {

  const { userId } = req.params
  
  try {

    const cart = await getCartByUserId(userId)
    res.send(cart)

  } catch (error) {

    res.send({
      message: "Requested cart was not found",
      name: "CartNotFoundError",
      error
    })
  }
})

cartRouter.post('/', async (req, res, next) => {

  const { productIds } = req.body;
  const cart = {};

  try {

    cart.productIds = productIds;

    if (!req.user) {
      cart.userId = null
    }
    else {
      cart.userId = req.user.id;
    }

    const newCart = await createCart(cart.userId, cart.productIds);

    res.send(newCart);

  } catch (error) {
    throw (error)
  }
})

cartRouter.patch("/", async (req, res, next) => {

  const { productIds } = req.body;
  const cart = {};

  try {

    cart.userId = req.user.id
    cart.productIds = productIds

    const updatedCart = await updateCart(cart)
    res.send(updatedCart)

  } catch (error) {
    next(error)
  }
})

cartRouter.delete("/:userId", requireUser, async (req, res, next) => {

  try {

    const cart = await getCartByUserId(req.params.userId)

    if (cart && cart.userId === req.user.id) {

      const deletedCart = await destroyCart(req.params.userId);
      res.send(deletedCart);

    } else {

      next(cart ? {
        name: "UnauthorizedUserError",
        message: "You cannot delete a cart which is not yours"
      } : {
        name: "PostNotFoundError",
        message: "That cart does not exist"
      });
    }
    
  } catch (error) {

    res.send({
      name: "Delete Cart",
      message: "Failure to delete cart",
      error
    })
  }
})

module.exports = cartRouter;
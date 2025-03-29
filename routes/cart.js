const express = require("express");
const Cart = require("../models/cart.models");
const Product = require("../models/products.models");
const { isLoggedIn } = require("../middleware"); // Middleware to check authentication
const router = express.Router();

// Add item to cart
router.post("/add/:productId", isLoggedIn, async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.product.equals(productId));

    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      cart.items.push({ product: productId, quantity: parseInt(quantity) });
    }

    await cart.save();
    req.flash("success", "Item added to cart!");
    res.redirect("/cart");
  } catch (err) {
    console.error(err);
    res.redirect("back");
  }
});

// View cart items
router.get("/", isLoggedIn, async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
      res.render("cart/show", { cart });
    } catch (err) {
      console.error(err);
      res.redirect("back");
    }
  });
  
// Remove item from cart
router.post("/remove/:productId", isLoggedIn, async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user._id });
      cart.items = cart.items.filter((item) => !item.product.equals(req.params.productId));
  
      await cart.save();
      req.flash("success", "Item removed from cart!");
      res.redirect("/cart");
    } catch (err) {
      console.error(err);
      res.redirect("back");
    }
  });
  
module.exports=router;
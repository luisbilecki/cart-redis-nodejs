const express = require('express');

const redisInstance = require('../services/redis');
const cartController = require('../controllers/cart');
const validatorMiddleware = require('../middlewares/validator');
const asyncHandler = require('../middlewares/asyncHandler');
const { addItemRules, updateItemRules, deleteItemRules } = require('../validations/cart');

const router = express.Router();

// Get cart
router.get(
  '/:session', 
  asyncHandler((req, res) => cartController.getCart(req, res, redisInstance))
);

// Add item to cart
router.post(
  '/:session/items', 
  addItemRules, 
  validatorMiddleware, 
  asyncHandler((req, res) => cartController.addCartItem(req, res, redisInstance))
);

// Update cart item
router.put(
  '/:session/items/:itemId', 
  updateItemRules, 
  validatorMiddleware, 
  asyncHandler((req, res, next) => cartController.updateCartItem(req, res, next, redisInstance))
);

// Delete cart items
router.delete(
  '/:session/items/:itemId', 
  deleteItemRules, 
  validatorMiddleware, 
  asyncHandler((req, res) => cartController.deleteCartItem(req, res, redisInstance))
);

// Delete user cart
router.delete(
  '/:session', 
  asyncHandler((req, res) => cartController.clearCart(req, res, redisInstance))
);

module.exports = router;

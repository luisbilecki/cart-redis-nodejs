require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const redisInstance = require('./services/redis');

const cartController = require('./controllers/cartController');

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// TODO: VALIDATE DATA
// Get cart
app.get('/carts/:session', (req, res) => cartController.getCart(req, res, redisInstance));

// Add item to cart
app.post('/carts/:session/items', (req, res) => cartController.addCartItem(req, res, redisInstance));

// Update cart item
app.put('/carts/:session/items/:item', (req, res, next) => cartController.updateCartItem(req, res, next, redisInstance));

// Delete cart items
app.delete('/carts/:session/items/:item', (req, res) => cartController.deleteCartItem(req, res, redisInstance));

// Delete user cart
app.delete('/carts/:session', (req, res) => cartController.clearCart(req, res, redisInstance));

// Error handling
app.use(require('./errors/handler'));

const serverPort = process.env.SERVER_PORT || 3000;

app.listen(serverPort, ()=> {
  console.log(`App is running on port ${serverPort}`);
});

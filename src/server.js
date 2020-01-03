require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const cartRoutes = require('./routes/cart');

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/carts', cartRoutes);

// Error handling
app.use(require('./errors/handler'));

const serverPort = process.env.SERVER_PORT || 3000;

app.listen(serverPort, ()=> {
  console.log(`App is running on port ${serverPort}`);
});

module.exports = app;

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('testing'); 
});

const serverPort = process.env.SERVER_PORT || 3000;

app.listen(serverPort, ()=> {
  console.log(`App is running on port ${serverPort}`);
});

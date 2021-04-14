const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({version: '0.1', projectName: 'Quicky-messenge-apir'});
});

app.get('/hello', (req, res) => {
  res.send("ok  hello 123")
});

module.exports = app;

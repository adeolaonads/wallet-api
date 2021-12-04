require("dotenv").config();
require("./config/mongoose").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

// Logic here

module.exports = app;

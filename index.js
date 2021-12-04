const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const validator = require("validator");
const express = require("express");
require('./config/mongoose')
const Wallet = require("./model/wallet")
const walletRouter = require("./routers/wallet")

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;


app.use(express.json());
app.use(walletRouter)



// server listening
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



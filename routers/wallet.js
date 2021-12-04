const express = require('express');
const Wallet = require('../model/wallet')
const router = new express.Router();

// Create new wallet
router.post('/wallets/create', async (req, res) => {
    const wallet = new Wallet(req.body)

    try{
         await wallet.save()
         res.status(201).send(wallet)
    } catch(err){
        res.status(400).send(err)
    }
})

// Login
router.post('/wallets/login', async (req, res) => {
    try {
        const wallet = await Wallet.findByCredentials(req.body.email, req.body.password)
        const token = await wallet.generateAuthToken()
        res.send({ wallet, token })
    } catch (err) {
        res.status(400).send()
    }
})

// To get details on all wallets in the collection
router.get("/wallets", async (req, res) => {
  try {
    const wallets = await Wallet.find({});
    res.send(wallets);
  } catch (err) {
    res.status(500).send();
  }
});

// TO get single wallet info
router.get("/wallets/:id", async (req, res) => {
  const _id = req.params.id;
  

  try {
    const wallet = await Wallet.findById(_id);

    if (!wallet) {
      return res.status(404).send();
    }
    res.send(wallet);
  } catch (err) {
    res.status(500).send();
  }
});

// To update wallet info
router.patch("/wallets/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  console.log(updates);
  const allowUpdates = ["name", "email", "password", "amount"];
  const isValidOperation = updates.every((update) =>
    allowUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid update!" });
  }

  try {
    const wallet = await Wallet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!wallet) {
      return res.status(404).send();
    }
    res.send(wallet);
  } catch (err) {
    res.status(400).send(err);
  }
});




// To transfer funds
router.post("/wallets/transfer", async (req, res) => {
  const {senderId, receiverId, transferAmount} = req.body;
  senderConditions = {_id: senderId};
  receiverConditions = {_id: receiverId};

  let senderBalance = await Wallet.findById(senderConditions);
  let receiverBalance = await Wallet.findById(receiverConditions);

  if(senderBalance !== undefined && receiverBalance !== undefined){
    let receiverNewBalance = parseInt(receiverBalance.amount + transferAmount);
    let senderNewBalance = parseInt(senderBalance.amount - transferAmount);
    try {
      const senderWallet = await Wallet.findByIdAndUpdate(senderId, {amount: senderNewBalance }, {
        new: true,
        runValidators: true,
      });
      const receiverWallet = await Wallet.findByIdAndUpdate(receiverId, {amount: receiverNewBalance }, {
        new: true,
        runValidators: true,
      });
      res.status(201).json({senderWallet, receiverWallet});
    }catch (err) {
      res.status(400).send(err);
    }
  } 
})
module.exports = router
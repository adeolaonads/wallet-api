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

router.post('/wallets/login', async (req, res) => {
    try {
        const wallet = await Wallet.findByCredentials(req.body.email, req.body.password)
        const token = await wallet.generateAuthToken()
        res.send({ wallet, token })
    } catch (err) {
        res.status(400).send()
    }
})

router.get("/wallets", async (req, res) => {
  try {
    const wallets = await Wallet.find({});
    res.send(wallets);
  } catch (err) {
    res.status(500).send();
  }
});

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

router.patch("/wallets/:id", async (req, res) => {
  const updates = Object.keys(req.body);
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


//

// To transfer funds
router.post("/wallets/transfer/", async (req, res) => {
  // const wallet = await Wallet.findByIdAndUpdate(req.params.id, req.body.amount, {
    const email = req.query.email
    const id = req.query.id
    const amount = req.query.amount
    res.send(req.query)
    console.log(req.query)
 //  })
});


module.exports = router;
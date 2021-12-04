const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
 
const walletSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password cannot contain password");
        }
      },
    },
    amount: {
      type: Number,
      min: 0,
      default: 0,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
  },
  { timestamps: true }
);

walletSchema.methods.generateAuthToken = async function() {
    const wallet = this
    const token = jwt.sign({ _id: wallet._id.toString() }, "thisismypasswordlol")

   wallet.tokens = wallet.tokens.concat({ token })
    await wallet.save()
    return token

}

walletSchema.statics.findByCredentials = async (email, password) => {
    const wallet = await Wallet.findOne({email})
    if(!wallet) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, wallet.password)
    if(!isMatch) {
        throw new Error('Unable to login')
    }
    return wallet
}

walletSchema.pre('save', async function (next) {
    const wallet = this
    if(wallet.isModified('password')) {
        wallet.password = await bcrypt.hash(wallet.password, 8)
    }
    next()
})

const Wallet = mongoose.model(
  "Wallet", walletSchema);



module.exports = Wallet;

// const wallet = new Wallet({
//   name: "Adeola Onads",
//   email: "adeolaonads@gmail.com",
//   password: "password",
// });

// wallet
//   .save()
//   .then(() => {
//     console.log(wallet);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const mongoose = require('mongoose');
const  validator  = require('validator');
// const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    firstname:{
        type: String,
    },
    lastname:{
        type: String,
    },
    tel:{
        type: String,
    },
    username:{
        type: String,
    },
    state:{
        type: String,
    },
    dob:{
        type: String,
    },
    city:{
        type: String,
    },
     account_name:{
        type: String,
        default:"gcash holder"
    },
    account_no:{
        type: String,
        default: "799907788878"
    },

    question:{
        type: String,
    },
    answer:{
        type: String,
    },
    email:{
        type: String,
        unique: true,
        lowercase: true,
        required: validator.isEmail['Please enter an email']
        // required:  [isEmail, 'Please enter an email']
    },
  
    country:{
        type: String
    },
    gender:{
        type: String
    },
    account:{
        type: String
    },
    password:{
        type: String,
    },
    session:{
        type: String,
        default:"0/0"
    },
    currency:{
        type: String
    },
     btc_add:{
     type: String,
     default:"bc1qygh4gav33x6zkur3xpu075xg6f8gjjjv4efmml"
 }, 
 
 eth_add:{
     type: String,
     default:"Loading"
 }, 
 
 usdt_add:{
     type: String,
     default:"0xf8461E1A3a05534989f65C1002B2D05E47e10Ee8"
 }, 
    image:{
        type: String,
    }, 
    balance:{
        type: String,
        default: "$0.00"
    },
    available:{
        type: String,
        default: "$0.00"
    },
    bonus:{
        type: String,
        default: "$0.00"
    },
    widthdrawBalance:{
        type: String,
        default: "$0.00"
    },
    profit:{
        type: String,
        default: "$0.00"
    },
    totalDeposit:{
        type: String,
        default: "$0.00"
    },

    totalWidthdraw:{
        type: String,
        default: "$0.00"
    },
    plans: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'plan'
    },
    verifiedStatus:{
        type: String,
        default: 'Account not yet Verified!'
    },

    livetrades: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'livetrade'
    },
    upgrades: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'upgrade'
    },
    verified:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'verify'
    },
   
    deposits:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'deposit'
    },

    widthdraws:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'widthdraw'
    },
    role:{
        type: Number,
        default: 0
    }
},{timestamps: true})

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await (password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };
  

const User = mongoose.model('user', userSchema)

module.exports = User;

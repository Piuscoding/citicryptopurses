

const mongoose = require('mongoose');


const planSchema = new mongoose.Schema({

    type:{
        type:String
    },

    amount: {
        type:String,
        default:"$0.00"
    },

    number: {
        type: String,
        default: "$0.00"
    },
    status: {
        type: String,
        default: 'pending'
    },

    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        // required: true
    }
}, {timestamps: true});

const Plan  = mongoose.model('plan', planSchema);

module.exports = Plan;
const { date } = require('joi');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const ledger = new Schema({
    MemberID:{
        type: mongoose.SchemaTypes.ObjectId,ref:'Member',
        require:true
    },
    date:{
        type:Date,
        require:true,
    },
    particulars:{
        type:String,
        require:true
    },
    chequeORdraft:{
        type:String,
        require:true
    },
    Slip:{
        type:String,
        require:true
    },
    debit:{
        type:Number,
        require:true
    },
    credit:{
        type:Number,
        require:true
    },
    balance:{
        type:Number,
        require:true
    },
    LedgerStatus:{
        type:Boolean,
        default:true
    }
},
    {timestamps:true}
);
module.exports = mongoose.model('Ledger',ledger)
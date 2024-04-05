const { date } = require('joi');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const expenditureManagement = new Schema({
    
    bankProfit:{
        type:Number,
        require:true
    },
    whTax:{
        type:Number,
        require:true
    },
    bankCharges:{
        type:Number,
        require:true
    },
    date:{
        type:Date,
        require:true,
    },
},
    {timestamps:true}
);
module.exports = mongoose.model('ExpenditureManagement',expenditureManagement)
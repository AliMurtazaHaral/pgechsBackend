const { date } = require('joi');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const expenditure = new Schema({
    
    particulars:{
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
    date:{
        type:Date,
        require:true,
    },
},
    {timestamps:true}
);
module.exports = mongoose.model('Expenditure',expenditure)
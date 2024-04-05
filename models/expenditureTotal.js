const { date } = require('joi');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const expenditure = new Schema({
    
    expenditure:{
        type:String,
        require:true
    },
    amount:{
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
module.exports = mongoose.model('ExpenditureTotal',expenditure)
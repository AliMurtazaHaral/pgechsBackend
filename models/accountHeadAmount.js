const { date } = require('joi');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const accountHeadAmount = new Schema({
    accountHeadId:{
        type: mongoose.SchemaTypes.ObjectId,ref:'AccountHead',
        require:true
    },
    date:{
        type:Date,
        require:true,
    },
    amount:{
        type:Number,
        require:true
    },
},
    {timestamps:true},
);
module.exports = mongoose.model('AccountHeadAmount',accountHeadAmount)
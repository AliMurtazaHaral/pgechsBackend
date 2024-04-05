const { date } = require('joi');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const accountHead = new Schema({
    
    head:{
        type:String,
        require:true
    },
},
    {timestamps:true}
);
module.exports = mongoose.model('AccountHead',accountHead)
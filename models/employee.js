const { date } = require('joi');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const employee = new Schema({
    name:{
        type:String,
        require:true
    },
    designation:{
        type:String,
        require:true
    },
    dateOfAppointment:{
        type:Date,
        require:true,
    },
},
    {timestamps:true},
);
module.exports = mongoose.model('Employee',employee)
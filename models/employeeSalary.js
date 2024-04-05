const { date } = require('joi');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const employeeSalary = new Schema({
    employeeId:{
        type: mongoose.SchemaTypes.ObjectId,ref:'Employee',
        require:true
    },
    dateOfSalary:{
        type:Date,
        require:true,
    },
    salary:{
        type:Number,
        require:true
    },
},
    {timestamps:true},
);
module.exports = mongoose.model('EmployeeSalary',employeeSalary)
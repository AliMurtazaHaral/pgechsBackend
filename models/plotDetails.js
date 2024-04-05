const { date } = require('joi');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const incomeStatement = new Schema({
    memberId: {
        type: mongoose.SchemaTypes.ObjectId, ref: "Plot",
        require: true
    },
    date:{
        type:Date,
        require:true,
    },
    otherIncome:{
        type:Number,
        require:true
    },
    slipNo:{
        type:Number,
        require:true
    },
    msFee:{
        type:Number,
        require:true
    },
    shareMoney:{
        type:Number,
        require:true
    },
    transferFee:{
        type:Number,
        require:true
    },
    pFee:{
        type:Number,
        require:true
    },
    masjidFund:{
        type:Number,
        require:true
    },
    ADC:{
        type:Number,
        require:true
    },
    suiGasCharges:{
        type:Number,
        require:true
    },
    bankProfit:{
        type:Number,
        require:true
    },
    cornerFee:{
        type:Number,
        require:true
    }
},
    {timestamps:true}
);
module.exports = mongoose.model('PlotDetails',incomeStatement)
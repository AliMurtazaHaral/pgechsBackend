const { boolean } = require('joi');
const mongoose = require('mongoose');
const{Schema} = mongoose;

const plots = new Schema({
    MemberID:{
        type: mongoose.SchemaTypes.ObjectId,ref:'Member',
        require:true
    },
    plotID:{
        type:String,
        require:true
    },
    dimensions:{
        type:String,
        require:true
    },
    plotType:{
        type:String,
        require:true
    },
    sqFeet:{
        type:String,
        require:true
    },
    location:{
        type:String,
        require:true
    },
    street:{
        type:String,
        require:true
    },
    block:{
        type:String,
        require:true
    },
    status:{
        type: Boolean,
        default:true
    }
},
    {timestamps:true}
)

module.exports = mongoose.model('Plot',plots);
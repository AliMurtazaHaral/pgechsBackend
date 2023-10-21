
const mongoose = require('mongoose');
const {Schema} = mongoose;

const members = new Schema({
    email:{
        type:String,
        require:true
    },
    password : {
        type:String,
        require:true
    },
    role:{
        type:mongoose.SchemaTypes.ObjectId,ref:"Role",
        require:true
    },
    MemberId:{
        type:String,
        require:true
    },
    ApplicationStatus:{
        type:Boolean,
        default:false
    }
},
    {timestamps:true}
);
module.exports = mongoose.model('MemberRegMod',members);
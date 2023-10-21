const mongoose = require('mongoose');
const {Schema} = mongoose;

const user = new Schema({
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type:mongoose.SchemaTypes.ObjectId,ref:"Role",
        require:true
    },
    id:{
        type:String,
    }
},
    {timestamps:true}
);
module.exports = mongoose.model('User',user);
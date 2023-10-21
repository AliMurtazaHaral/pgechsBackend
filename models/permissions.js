const mongoose = require('mongoose');
const {Schema} = mongoose;

const schema = new Schema({
    permissionName:{
      type:String,
      require:true
    },
},
    {timestamps:true}
);

module.exports = mongoose.model('Permission',schema);
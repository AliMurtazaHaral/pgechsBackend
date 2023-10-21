const mongoose = require('mongoose');
const {Schema} = mongoose;

const role = new Schema({
    role:{
        type:String,
        require:true
    },
    permission: [
        {
          Permission_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Permission",
            required: true,
          },
        },
      ],
    status:{
        type:Boolean,
        default:true
    }
},
    {timestamps:true}
);

module.exports = mongoose.model('Role',role);
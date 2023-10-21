const mongoose = require('mongoose');
const {Schema} = mongoose;

const accounts = new Schema({

    plotID:{
        type:mongoose.SchemaTypes.ObjectId, ref:'Plot',
        require:true
    },
    memberID:{
        type:mongoose.SchemaTypes.ObjectId,ref:'Member',
        require:true
    },
    LedgerID:{
        type:mongoose.SchemaTypes.ObjectId, ref:'Ledger',
        require:true
    },
  
},
    {timestamps:true}
);
module.exports = mongoose.model('Account',accounts);
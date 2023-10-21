const mongoose = require('mongoose');
const {Schema} = mongoose;

const Notification = new Schema({
    MemberID:{
        type: mongoose.SchemaTypes.ObjectId,ref:'Member',
    },
    SingleNotificationMessage:{
        type:String
    },
    CollectiveNotificationMessage:{
        type:String
    },
},
    {timestamps:true}
);

module.exports = mongoose.model('Notification',Notification);
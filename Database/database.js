const mongoose = require('mongoose');
const {MONGODB_CONNECTION_STRING} = require('../config/config');

const dbConnect = async() =>{
    try{
        const conn = await mongoose.connect(MONGODB_CONNECTION_STRING);
        console.log("DB IS CONNECTED TO: "+conn.connection.host);
    }
    catch(error){
        console.log("ERROR: "+error);
    }
}

module.exports = dbConnect;
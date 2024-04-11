const mongoose = require('mongoose')
const userschema = new mongoose.Schema({
    username : {
        type : String,
    },
    password : {
        type : String        
    },
    email : {
        type : String
    },
    phone : {
        type : String
    }
}, {timestamps:  true })
module.exports = mongoose.model('user',userschema)
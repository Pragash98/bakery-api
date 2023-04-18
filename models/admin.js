const mongoose = require('mongoose')
const adminschema = new mongoose.Schema({
    username : {
        type : String,
    },
    password : {
        type : String        
    },
}, {timestamps:  true })
module.exports = mongoose.model('admin',adminschema)
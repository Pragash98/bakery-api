const mongoose = require('mongoose')
const categoryschema = new mongoose.Schema({
    category_name :{
        type: String,
        required: true
    },
    slug_name:{
        type:String,
        required:true
    }
},
{ timestamps: true })


module.exports = mongoose.model('category', categoryschema);
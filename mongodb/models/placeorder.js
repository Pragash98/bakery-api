const mongoose = require('mongoose')
const orderschema = new mongoose.Schema({
    cart_id: {
        type: String,
        req:true,
    },
}, { timestamps: true })

module.exports = mongoose.model('order', orderschema);
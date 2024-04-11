const mongoose = require('mongoose')
const productschema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    itemImage: {
        type: String,
        required: false
    },
    categories:{
            type :[ mongoose.Schema.Types.ObjectId],
            ref:'category'
    }
}, { timestamps: true })
module.exports = mongoose.model('product', productschema);
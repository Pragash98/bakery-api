const mongoose = require('mongoose')
const cartschema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    cart:[{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },
        quantity:{
            type:Number
        }
    }],
    total: {
        type: Number
    },
}, { timestamps: true });


module.exports = mongoose.model('cart', cartschema);
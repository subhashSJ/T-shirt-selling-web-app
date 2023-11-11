const mongoose = require('mongoose');
//const category = require('./category');

const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
       
        maxlength: 32
    },
    description: {
        type: String,
        trim: true,
      
        maxlength: 2000
    },
    price: {
        type: Number,
        maxlength: 32,
       
        trim: true
    },
    category: {
        type: ObjectId,
        ref: 'Category',
    },
    stock: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    }
},
{timestamps: true}
);


module.exports = mongoose.model('Product', productSchema)
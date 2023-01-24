import mongoose from "mongoose";

const productsCollection = 'products';

const productsSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnails: {
        type: Array, 
        default:[]
    },
    code: Number,
    stock: Number,
    category: String,
    status: {
        type: Boolean,
        default: true
    }
});

const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;
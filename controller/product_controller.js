const Product = require("../models/product")
const Order = require("../models/placeorder");
const Cart = require("../models/cart");
const Category = require("../models/category");
const { query } = require("express");
const fs = require('fs');

exports.createproduct = async(req,res) => {
    const fileBuffer = fs.readFileSync(req.file.path);
    const base64File = fileBuffer.toString('base64');
    //  const { product_name } = req.body;
    //  const { price } = req.body;
    //  const itemImage = 'http://localhost:4000/images/' + req.file.filename;
    //  const { category } = req.body.categories;
     const products = new Product({
        product_name:req.body.product_name,
        price:req.body.price,
        itemImage:base64File,
        categories:
            req.body.category      
     })
     try{
         const savedProduct = await  products.save();
         res.status(200).json(savedProduct);
     } catch (err) {
         res.status(500).json(err);
     }
}

exports.viewproduct = async(req,res) =>{
    try{
        const products = await Product.find().populate('categories').exec();
        const imageDataBuffer = Buffer.from(products[8].itemImage);
        const base64Image = imageDataBuffer.toString('base64');
        res.status(200).json(products);
     
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.updateproduct = async(req,res) =>{
    try{
        // const update_product = await Product.findByIdAndUpdate(req.params.id,{ $set: req.body },{ new: true })
        // const update_product = await Product.findByIdAndUpdate(req.params.id,{$set : {product_name : req.body.product_name,price:req.body.price,itemImage:'http://localhost:4000/images/'+req.file.filename}},{ new:true} )
        if(req.body.deletecategory) {
            await Product.findByIdAndUpdate(req.params.id,
                {"$pullAll":{"categories":req.body.deletecategory}})
        }
        let query = {};
        if(req.body.product_name)
            query.product_name = req.body.product_name
        if(req.body.price)
            query.price = req.body.price
        if(req.file){
            const fileBuffer = fs.readFileSync(req.file.path);
            const base64File = fileBuffer.toString('base64');
            query.itemImage = base64File;

        }
        const update_product = await Product.findByIdAndUpdate(req.params.id,
            { 
                "$set":query,
                "$addToSet": {"categories": req.body.categories},
            },
            { new:true} )    
        update_product.save();
        res.status(200).json(update_product);
    }
    catch(err) {
        res.status(400).json({ message: err.message });
    }
}

exports.createcategory = async(req,res) => {
    try{
        const { category_name } = req.body;
        const { slug_name } = req.body;
        const category = new Category({
        category_name,
        slug_name
        })
        const savedCategory = await  category.save();
        res.status(200).json(savedCategory);
    }
    catch (err) {
        res.status(500).json(err);
    }  
}

exports.getallcategory = async(req,res) =>{
    try {
        const allcategory = await Category.find();
        res.status(200).json(allcategory);
    } catch (err) {
        res.status(500).json(err);
    } 
}

exports.categoryfilter = async(req,res) =>{
    try {
        var query = { "categories": req.body.categories, }; 
        const categoryfilter = await Product.find(query);
        res.status(200).json(categoryfilter);
    } catch (err) {
        res.status(500).json(err);
    } 
}

exports.deletecategory = async(req,res) =>{
    try{
        await Category.findByIdAndDelete(req.body.category)
        res.status(200).json("category has been deleted")
    }
    catch(err) {
        res.status(400).json({ message: err.message });
    }
}

exports.placeorder = async(req,res) =>{
    const orderid = req.params.id;
    var order = await Cart.findById(orderid)
    const neworder = new Order({
        cart_id : orderid,
    })
    try{
        const savedOrder = await neworder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.viewallorders = async(req,res) =>{
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    } 
}

exports.viewusersorders = async(req,res) => {
    try {
        let id = req.user;
        const orders = await Order.find({ user_id: id }).populate("user_id").populate("product_id").exec();
        res.status(200).json(orders);
        
    } catch (err) {
        res.status(500).json(err);
    }
}
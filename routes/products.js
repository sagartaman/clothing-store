const express = require("express");
const router = express.Router();
const Product= require("../models/products.models");
const { isLoggedIn, isOwner } = require("../middleware");

router.get("/products",async(req,res)=>{
    let products= await Product.find({});
    res.render("./products/index.ejs",{products});
})

router.get("/products/new",isLoggedIn,(req,res)=>{
    res.render("./products/new.ejs");
})

router.get("/products/:id",isLoggedIn,async(req,res)=>{
    let {id}=req.params;
    let product= await Product.findById(id).populate("reviews").populate("owner");
    res.render("./products/show.ejs",{product});
})

router.post("/products",isLoggedIn,async(req,res)=>{
    let newProduct= await new Product(req.body.product);
    newProduct.owner = req.user._id;
    await newProduct.save();
    req.flash("success","New Brand Clothes Added!")
    res.redirect("/products");
})

router.get("/products/:id/edit",isLoggedIn,isOwner,async(req,res)=>{
    let {id}= req.params;
    const product= await Product.findById(id);
    res.render("./products/edit.ejs",{product});
})

router.put("/products/:id",isLoggedIn,isOwner,async(req,res)=>{
    let {id}= req.params;
    const product= await Product.findByIdAndUpdate(id,{...req.body.product});
    req.flash("success","Your product updated successfully!")
    res.redirect(`/products/${id}`);
})

router.delete("/products/:id",isLoggedIn,isOwner,async(req,res)=>{
    let {id}=req.params;
    await Product.findByIdAndDelete(id);
    req.flash("success","Product Deleted!")
    res.redirect("/products");
})
module.exports = router;
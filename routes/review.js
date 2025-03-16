const express= require('express');
const router= express.Router({mergeParams:true});
const Product= require("../models/products.models");
const Review= require("../models/review.models");

router.post("/products/:id/reviews",async(req,res)=>{
    let product= await Product.findById(req.params.id);
    let newReview= await new Review(req.body.review);
    product.reviews.push(newReview);
    await product.save();
    await newReview.save();
    res.redirect(`/products/${product._id}`);
})

router.delete("/products/:id/review/:reviewId",async(req,res)=>{
    let{id,reviewId}=req.params;
    await Product.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/products/${id}`);
})

module.exports= router;
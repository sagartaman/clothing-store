const mongoose = require("mongoose");
const Review= require("./review.models");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: {
    type: String,
    default:
      "https://gratisography.com/wp-content/uploads/2024/03/gratisography-funflower-800x525.jpg",
    set: (v) =>
      v === ""
        ? "https://gratisography.com/wp-content/uploads/2024/03/gratisography-funflower-800x525.jpg"
        : v,
  },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  reviews:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Review",
    }
  ],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
},
});

productSchema.post("findOneAndDelete",async(product)=>{
  if(product){
    await Review.deleteMany({_id:{$in:product.reviews}});
  }
})

module.exports = mongoose.model("Product", productSchema);

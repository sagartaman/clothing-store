const mongoose = require("mongoose");
const initData= require("./data.js");
const Product = require("../models/products.models");
const MONGODB_URI="mongodb://127.0.0.1:27017/clothDB"
main()
  .then(() => {
    console.log("connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGODB_URI);
}


const initDB= async()=>{
    await Product.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'67e62cddf1f8565b84395e2f'}))
    await Product.insertMany(initData.data);
    console.log("data was intitialze");
}

initDB();
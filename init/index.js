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
    await Product.insertMany(initData.data);
    console.log("data was intitialze");
}

initDB();
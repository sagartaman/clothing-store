const Product= require("./models/products.models")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.redirectUrl= req.originalUrl;
      req.flash("error", "You must be loggedIn");
      return res.redirect("/login");
    }
    next();
  };
  
  module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
      res.locals.redirectUrl=req.session.redirectUrl;
    }
    next()
  ;}

module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  let product= await Product.findById(id)
  if(!product.owner.equals(res.locals.currUser._id)){
    req.flash("error","You have not created this product!")
     return res.redirect(`/product/${id}`);
  }
  next();
}

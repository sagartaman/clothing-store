const express = require("express");
const router = express.Router();
const User= require("../models/users.models.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs");
})

router.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Product Store!");
      res.redirect("/products");
    });
  } catch (e) {
    req.flash("error", e.mesage);
    res.redirect("/signup");
  }
});

router.get("/login",(req,res)=>{
    res.render("./users/login.ejs");
})

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to Jeesa Store!");
    let redirectUrl= res.locals.redirectUrl || "/products";
    res.redirect(redirectUrl);
  }
);

router.get("/logout",(req,res)=>{
    req.logout((err) => {
        if (err) {
          return next();
        }
        req.flash("success","You are logged out successfully")
        res.redirect("/products");
      });
})



module.exports = router;
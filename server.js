if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
const express = require('express');
const app = express();
const PORT = 8080;
const path = require('path');
const methodOverride= require('method-override');
const ejsMate = require('ejs-mate');
const session= require('express-session');
const MongoStore= require("connect-mongo");
const flash= require('connect-flash');
const passport= require('passport');
const LocalStrategy= require('passport-local');

const User= require("./models/users.models.js");

const productRouter= require("./routes/products.js");
const userRouter= require("./routes/users.js");
const searchRouter= require("./routes/search.js");
const reviewRouter= require("./routes/review.js");


const mongoose = require('mongoose');
main().then(() => {
    console.log("connected to the database");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
}

// Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine('ejs', ejsMate);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const store= MongoStore.create({
    mongoUrl:process.env.MONGODB_URI,
    crypto:{
        secret:process.env.SESSION_SECRET,
    },
    touchAfter: 24*3600,
})

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err)
})

const sessionOptions={
    store,
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitilized:true,
    cookie:{
        expire: Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/",productRouter);
app.use("/",userRouter);
app.use("/",reviewRouter);
app.use("/",searchRouter);

app.listen(PORT, () => {
    console.log(`server is listening to the URL: http://localhost:${PORT}/products`);
});


















































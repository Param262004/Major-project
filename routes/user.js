const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
// const wrapAsync = require("../utils/wrapAsync.js");
const {saveRedirectUrl} = require("../middleware.js");

// const userController = require("../controllers/user.js")


router.get("/signup",(req, res)=>{
    res.render("users/signup.ejs");
});


router.post("/signup",async(req,res)=>{

    try{
        const {username, password, email} = req.body;
        const newUser = new User({username,email});
        const registeredUser= await User.register(newUser, password);
        console.log(registeredUser);
    
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    
       
       }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
       }
    });
   


router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
});


router.post("/login", saveRedirectUrl,
 passport.authenticate("local",
 {failureRedirect: "/listings",
 successRedirect:"/listings",
  
  failureFlash: true}),async(req,res)=>{

    try{
    let{username,Password}=req.body;
    const newUser = new User({username,Password});
     const registeredUser=await User.register(newUser,Password);
     console.log(registeredUser);
     req.flash("success","welcome to wanderlust!");
     res.redirect("/listings");
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/login");

    }

});

router.get("/logout",(req, res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
});


module.exports = router;


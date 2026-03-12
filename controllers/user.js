const User = require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username});
        const regUser=await User.register(newUser,password);
        console.log(regUser);
        req.login(regUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        });  
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/user/signup");
    }   
    
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("user/login.ejs");
}

module.exports.login=async(req,res)=>{
            req.flash("success","Welcomeback to wanderlust!");
            let redirectUrl=res.locals.redirectUrl || "/listings";
            res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
          return  next(err);
        }
        req.flash("success","You have logged out successfully !");
        res.redirect("/listings");
    })
}
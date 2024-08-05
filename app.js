const express=require("express");
const mongoose=require("mongoose");
const app=express();
const Listing=require("./models/listings.js")
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

app.engine("ejs",ejsMate);

Mongo_Url="mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(Mongo_Url);
}
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})
app.listen(8080,()=>{
    console.log("app is listening to port 8080");
})

app.get("/",(req,res)=>{
    res.send("I am root");
})

// app.get("/testSchema",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"come near to beach",
//         description:"Aparment near beach",
//         price:2000,
//         location:"Panjim,Goa",
//         country:"India",
//     })

//     await sampleListing.save();
//     console.log("data save to db");
//     res.send("success");
// })

app.get("/listings",async(req,res)=>{
    allListings=await Listing.find();
    res.render("listings/index.ejs",{allListings});
})

//create route
app.get("/listings/new",async(req,res)=>{
    res.render("listings/new.ejs");
})

//new route
app.post("/listings",(req,res)=>{
    newListing=new Listing(req.body.listing);
    newListing.save();
    res.redirect("/listings");
})

app.get("/listings/:id",async(req,res)=>{
    id=req.params.id;
    listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    id=req.params.id;
    listing=await Listing.findById(id)
    res.render("listings/edit.ejs",{listing})
})

//update route
app.put("/listings/:id",async(req,res)=>{
    id=req.params.id;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//delete route
app.delete("/listings/:id",async(req,res)=>{
    id=req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

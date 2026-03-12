const Listing=require("../models/listing.js")
const axios = require("axios");

module.exports.index=async(req,res)=>{
    allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.addNewListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // Get location from form
    const location = req.body.listing.location;

    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${location}`,
            {
                headers: {
                    "User-Agent": "MyListingApp"
                }
            }
        );

        if (response.data.length > 0) {
            const lat = response.data[0].lat;
            const lon = response.data[0].lon;

            newListing.geometry = {
                type: "Point",
                coordinates: [lon, lat]
            };
        }

    } catch (err) {
        console.log("Geocoding error:", err);
    }

    await newListing.save();

    req.flash("success", "New listing added successfully!");
    res.redirect("/listings");
};

module.exports.renderEditForm=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing doesnot exists");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.showlisting=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing doesnot exists");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },    
    );

    // If new image uploaded
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};


module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted successfully!")
    res.redirect("/listings");
}
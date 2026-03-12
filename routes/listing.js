const express= require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedin,isOwner,validateListing}=require("../middleware.js")
const multer  = require("multer")
const{storage}=require("../cloudConfig.js");
const upload = multer({ storage })
const listingController=require("../controllers/listing.js")

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedin, upload.single('listing[image]'),validateListing,wrapAsync(listingController.addNewListing));

router.get("/new",isLoggedin,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showlisting))
.put(isLoggedin,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedin,isOwner,wrapAsync(listingController.deleteListing));

router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.renderEditForm));



module.exports = router;
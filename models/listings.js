const mongoose=require("mongoose");
const Schema= mongoose.Schema;

listingSchema=new Schema({
    title:{
        type:String,
        require:true
    },
    description:String,
        image: {
            filename: {
              type: String,
            },
            url: {
              type: String,
              default:"https://unsplash.com/photos/a-view-of-a-city-from-inside-a-cave-paom1k1m0hQ",
            },
          },
        // set:(v)=>
        //     v=== "" 
        //     ? "https://unsplash.com/photos/a-view-of-a-city-from-inside-a-cave-paom1k1m0hQ"
        //     :v,
            
    price:Number,
    location:String,
    country:String
});

const Listing=new mongoose.model("Listing",listingSchema);
module.exports=Listing;
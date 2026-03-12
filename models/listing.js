const mongoose=require("mongoose");
Schema=mongoose.Schema;
const Review=require("./reviews")

const listingSchema=new Schema({
    title:{
        type:String,
        require:true
    },
    description:String,
    image:{
        filename: { type: String},
        url: { type: String,
        set:(v)=>
            v===""
            ?"https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80"
            :v,}  
    },
    
    price:Number,
    location:String,
    country:String,
    reviews:[{ type: Schema.Types.ObjectId, ref: "Reviews" }],
    owner:{type:Schema.Types.ObjectId,ref:"User"},
    geometry: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: [Number]
  }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
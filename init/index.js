const mongoose = require("mongoose");
const axios = require("axios");
const initData = require("../init/data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/major_project";

main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {

    await Listing.deleteMany({});

    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner:"69a7f7b6f67cb23b2effb047"
    }));

    const listings = await Listing.insertMany(initData.data);

    console.log("data was initialized");

    // Convert location to coordinates
    for(let listing of listings){

        const locationQuery = `${listing.location}, ${listing.country}`;

        console.log("Searching:", locationQuery);

        try{

            const response = await axios.get(
                "https://nominatim.openstreetmap.org/search",
                {
                    params:{
                        q: locationQuery,
                        format:"json",
                        limit:1
                    },
                    headers:{
                        "User-Agent":"wanderlust-app"
                    }
                }
            );

            if(response.data.length > 0){

                const lat = response.data[0].lat;
                const lon = response.data[0].lon;

                await Listing.findByIdAndUpdate(listing._id,{
                    geometry:{
                        type:"Point",
                        coordinates:[parseFloat(lon),parseFloat(lat)]
                    }
                });

                console.log("Updated:", listing.title);

            }else{
                console.log("Location not found:", locationQuery);
            }

        }catch(err){
            console.log("Error:", err.message);
        }

        // avoid API rate limit
        await new Promise(r => setTimeout(r,1200));
    }

    console.log("All listings updated with coordinates");
};

initDB();
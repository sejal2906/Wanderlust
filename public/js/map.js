document.addEventListener("DOMContentLoaded", function(){

const mapDiv = document.getElementById("map");

// get coordinates from data attribute
const coordinates = JSON.parse(mapDiv.dataset.coordinates || "[]");
const title = mapDiv.dataset.title;

console.log("Coordinates from DB:", coordinates);

// if coordinates exist
if(coordinates.length === 2){

const lat = coordinates[1];
const lng = coordinates[0];

// initialize map
const map = L.map('map').setView([lat, lng], 10);

// load tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '&copy; OpenStreetMap'
}).addTo(map);

// add marker
L.marker([lat, lng])
.addTo(map)
.bindPopup(title)
.openPopup();

// fix rendering issue
setTimeout(() => {
map.invalidateSize();
}, 200);

}
else{

// fallback if coordinates missing
const map = L.map('map').setView([20,78], 3);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '&copy; OpenStreetMap'
}).addTo(map);

}

});

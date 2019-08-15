$(document).ready(function ($) {

  var url = 'https://api.nasa.gov/planetary/apod?api_key=PgRhox3uHogMFEF8zpp5zkWiWWEGP0qlMU90vRrH';
  var lat = '';
  var long = '';

  $.ajax({
    url: url,
    success: function(result){
    if("copyright" in result) {
      $("#copyright").text("Image Credits: " + result.copyright);
    }
    else {
      $("#copyright").text("Image Credits: " + "Public Domain");
    }

    if(result.media_type == "video") {
      $("#apod_img_id").css("display", "none");
      $("#apod_vid_id").attr("src", result.url);
    }
    else {
      $("#apod_vid_id").css("display", "none");
      $("#apod_img_id").attr("src", result.url);
    }
    $("#reqObject").text(url);
    $("#returnObject").text(JSON.stringify(result, null, 4));
    $("#apod_explaination").text(result.explanation);
    $("#apod_title").text(result.title);
  }
}).then(
  //open-notify ISS json
  $.ajax({
    url: 'http://api.open-notify.org/iss-now.json',
    success: function(result) {
      lat = result.iss_position.latitude;
      long = result.iss_position.longitude;
    }
  })
).done(function(){
  //leaflet/mapbox API map
  var mymap = L.map('mapid').setView([lat, long], 2);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    minZoom: 1,
    maxZoom: 14,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoicm9kLXMiLCJhIjoiY2p6YmNqYzl2MDViMzNjcGFhMWI3Y254eiJ9.iRyd5tlYddW2kGVLH9tJWg'
  }).addTo(mymap);
var marker = L.marker([lat, long]).addTo(mymap);
marker.bindPopup(`<b>ISS is directly above this spot!</b><br>Coordinates: ${lat}, ${long}.`).openPopup();
})

});

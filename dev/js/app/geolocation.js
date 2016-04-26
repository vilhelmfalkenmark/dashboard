/*###########################################
############################################
      SECTION GEOLOCATION KOORDINATER
############################################
############################################*/

var long;
var lat;

 function getLocation() {
     if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(showPosition);
     } else {
         alert("Geolocation stödjs inte i den här browsern och vi kan därför inte hitta din plats");
     }
 }
 function showPosition(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    findCloseDepartures(lat,long);
 }

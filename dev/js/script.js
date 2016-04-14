/**
 * Created by Vilhelm on 15-11-30.
 */
$( document ).ready(function() {


/*###########################################
 ############################################
                   KLOCKA
 ############################################
 ############################################*/
var allDate = new Date();

var weekDays = ["söndag","måndag","tisdag","onsdag","torsdag","fredag","lördag"];
var months = ["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"];

var currentWeekday = allDate.getDay();
var currentDay = allDate.getDate();
var currentMonth = allDate.getMonth();

$(".date").html(weekDays[currentWeekday]+" "+currentDay+" "+months[currentMonth])


function updateClock() {
 var allTime = new Date();
 var currentHour = allTime.getHours();
 var currentMinute = allTime.getMinutes();
 var currentSecond = allTime.getSeconds();
 currentMinute = ( currentMinute < 10 ? "0" : "" ) + currentMinute;
 currentSecond = ( currentSecond < 10 ? "0" : "" ) + currentSecond;
 $(".time").html(currentHour+":"+currentMinute+":"+currentSecond)
}
setInterval(function(){
 updateClock()
}, 1000);



/*###########################################
 ############################################
              VÄDER FRÅN SMHI
 ############################################
 ############################################*/
var smhiRequest = "http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/59.32/lon/18.05/data.json";

 var today = new Date();
 var res = $.getJSON(smhiRequest, function(json) {
   // console.log(json);
   var observations = [];
   var allObservations = json.timeseries;
   var limiter = 1;

   var numberOfObservation = 6;
   function findWeather()
   {
     for (var i = 0; i < allObservations.length; i++) {
      if(allObservations[i].validTime.substr(8,2) == currentDay && allObservations[i].validTime.substr(11,2) == today.getHours())
      {
       for (var j = 0; j <= 24; j+=numberOfObservation) {
        observations.push(allObservations[i+j]);
       }
       return false;
      }
     }
   }
   findWeather();


   for (var k = 0; k < observations.length; k++) {

    var observation = document.createElement("div");
    observation.className = "observation";

    observation.innerHTML = "<p class='weather-date'>"+observations[k].validTime+"</p>";
    observation.innerHTML += "<p class='weather-temp'>"+observations[k].t+"</p>";
    observation.innerHTML += "<p class='weather-windspeed'>"+observations[k].ws+"</p>";
    observation.innerHTML += "<p class='weather-winddirection'>"+observations[k].wd+"</p>";
    observation.innerHTML += "<p class='weather-cloud'>"+observations[k].tcc+"</p>";
    observation.innerHTML += "<p class='weather-rain'>"+observations[k].pit+"</p>";
    $(".weather-container").append(observation);
   }

 })

/*###########################################
 ############################################
 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                RESEPLANERARE
 ############################################
 ###########################################*/

$.ajax({
     type: "GET",
     url:  "data.php?lat=59.3024216&long=18.1870591", // Chas
     // url:  "data.php?lat=59.3490464&long=18.065024", // Körsbärsvägen
     // url:  "data.php?lat=59.319600&long=18.072087", // Slussen
     // url:  "data.php?lat=59.3458412&long=18.0649849", // Stockholm Östra
     dataType: "JSON",
     // jsonpCallback: 'callback',
     success: function(response) {
       console.log(response);

      for (var i = 0; i < response.length; i++) {
         var distance = document.createElement("span");
         distance.innerHTML = response[i].distance;
         for (var key in response[i].ResponseData) {
           if(response[i].ResponseData[key].constructor === Array && response[i].ResponseData[key].length > 0) {

             var stationContainer = document.createElement("div");
             stationContainer.className = "station-container";

             var stationName = document.createElement("span")
             stationName.className = "station-name";
             stationName.innerText = response[i].ResponseData[key][0].StopAreaName+" ";

             var distance = document.createElement("span")
             distance.className = "distance-to-station";
             distance.innerText = response[i].distance+" meter ";

             var stationId = document.createElement("span");
             stationId.innerText = response[i].ResponseData[key][0].SiteId;


             var stationNameHeader = document.createElement("h3");

             stationNameHeader.appendChild(stationName)
             stationNameHeader.appendChild(distance)
             stationNameHeader.appendChild(stationId)

             stationContainer.appendChild(stationNameHeader)

             var ul = document.createElement("ul");
             ul.className = "departure-list";

             for (var k = 0; k < response[i].ResponseData[key].length; k++) {

              var li = document.createElement("li");

              var lineNumber = document.createElement("span");
              lineNumber.innerHTML = response[i].ResponseData[key][k].LineNumber+" ";

              var transportMode = document.createElement("span");
              // transportMode.innerHTML = response[i].ResponseData[key][k].TransportMode+" ";
              if(response[i].ResponseData[key][k].TransportMode == "BUS") {
               transportMode.innerHTML = "Buss ";
              }
              else if(response[i].ResponseData[key][k].TransportMode == "METRO") {
               transportMode.innerHTML = "Tunnelbana ";
              }
              else if(response[i].ResponseData[key][k].TransportMode == "TRAM") {
               transportMode.innerHTML = "Lokalbana ";
              }
              else if(response[i].ResponseData[key][k].TransportMode == "BOAT") {
               transportMode.innerHTML = "Båt ";
              }

              var destination = document.createElement("span");
              destination.innerHTML = response[i].ResponseData[key][k].Destination+" ";

              var displayTime = document.createElement("span");
              displayTime.innerHTML = response[i].ResponseData[key][k].DisplayTime;

             li.appendChild(lineNumber)
             li.appendChild(transportMode)
             li.appendChild(destination)
             li.appendChild(displayTime)

              ul.appendChild(li);

             }
             stationContainer.appendChild(ul);

           }
           $(".public-transport-container").append(stationContainer);
         }
      }

      /*###########################################
       ############################################
               Hitta dubbletter i svaret
       ############################################
       ############################################*/

       var departureList = document.getElementsByClassName('departure-list')

       // for (var l = 0; l < departureList.length; l++) {
       //
       //    for (var k = 0; k < departureList.length; k++) {
       //
       //     if(stationNames[l].innerText == stationNames[k].innerText && k != l )
       //     {
       //      stationNames[k].className += " duplicate";
       //     }
       //
       //     }
       //
       // }


     },
     error: function() {
      console.log('Inget svar från API');
     }
 });




/*===========================================
 ======== FÅ GEOLOCATION KOORDINATER ========
 ==========================================*/
 var x = document.getElementById("demo");
 function getLocation() {
     if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(showPosition);
     } else {
         x.innerHTML = "Geolocation is not supported by this browser.";
     }
 }
 function showPosition(position) {
     x.innerHTML = "Latitude: " + position.coords.latitude +
     "<br>Longitude: " + position.coords.longitude;
 }
  getLocation();



});

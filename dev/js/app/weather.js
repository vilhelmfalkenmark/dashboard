
 /*###########################################
 ############################################
 VÄDER FRÅN SMHI
 ############################################
 ############################################*/

 // function getWeather(lat,long) {
 // // var latitude = lat.substr(0,4);
 // // var longitude = long.substr(0,4);
 // console.log("Väder kallad!")
 function getWeather() {

 // var smhiRequest = "http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/"+latitude+"/lon/"+longitude+"/data.json";
 var smhiRequest = "http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/59.32/lon/18.05/data.json";

 var today = new Date();
 var res = $.getJSON(smhiRequest, function(json) {
  // console.log(json);
  var observations = [];
  var allObservations = json.timeseries;
  var limiter = 1;

  var numberOfObservation = 12;

  currentDay = today.getDate();


  function findWeather() {
   for (var i = 0; i < allObservations.length; i++) {
    if (allObservations[i].validTime.substr(8, 2) == currentDay && allObservations[i].validTime.substr(11, 2) == today.getHours()) {
     for (var j = 0; j <= 56; j += 8) {
      observations.push(allObservations[i + j]);
     }
     return false;
    }
   }
  }
  findWeather();
  console.log(allObservations);

  var cloudIcons = ["flaticon-weather-2", "flaticon-summer", "flaticon-summer", "flaticon-nature",
  "flaticon-cloud-1", "flaticon-cloud-4", "flaticon-cloud-4", "flaticon-sky", "flaticon-sky", "flaticon-sky" /* SLUT VANLIGA MOLN */
 ];
 var rainIcons = ["flaticon-weather-4", "flaticon-cloud-3"];

 var cloudText = ["Klart", "Överlag klart", "Halvklart", "Lätt molnighet", "Lite moln", "Molnigt", "Nästan mulet", "Mulet", "Mulet", "Kraftigt molntäcke"]
 var rainText = ["Ingen nederbörd", "Lätt nederbörd", "Måttlig nederbörd", "Kraftig nederbörd"];

 for (var k = 0; k < observations.length; k++) {

  var observation = document.createElement("div");


  observation.className = "observation";

  var weatherDate = document.createElement("h4");

  if (k == 0) {
   weatherDate.innerHTML = "Just nu";
  } else {

   if (observations[k].validTime.substr(8, 2) == currentDay) {
    weatherDate.innerHTML = "Idag klockan " + observations[k].validTime.substr(11, 2);
   } else if (observations[k].validTime.substr(8, 2) == currentDay + 1) {
    weatherDate.innerHTML = "Imorgon klockan " + observations[k].validTime.substr(11, 2);
   }
   else  {
   // weatherDate.innerHTML = observations[k].validTime.substr(5, 10)+"/"+observations[k].validTime.substr(5, 2)+" Klockan "+ observations[k].validTime.substr(11, 2);
   weatherDate.innerHTML = observations[k].validTime;
  }
  }
  var weatherTemp = document.createElement("span");
  weatherTemp.className = "weather-temp";
  weatherTemp.innerHTML = observations[k].t + "<i class='flaticon-weather'></i>";

  var windSpeed = document.createElement("span");
  windSpeed.className = "weather-windspeed";
  windSpeed.innerHTML = observations[k].ws + " m/s";

  var windDirection = document.createElement("span");
  windDirection.className = "weather-winddirection";
  // windDirection.innerHTML = " <i class='fa fa-arrow-up'></i>";
  // windDirection.style.transform = "rotate("+observations[k].wd+"deg)";

  var windIcon = document.createElement("i");
  windIcon.className = "fa fa-arrow-down";
  windIcon.style.transform = "rotate(" + observations[k].wd + "deg)";

  windDirection.appendChild(windIcon);

  var clouds = document.createElement("i");

  if (observations[k].pit == 0) { // Om nederbörd är 0 visa ikon utan regn
   clouds.className = cloudIcons[observations[k].tcc] + " cloudicon";
  } else if (observations[k].pit > 0 && observations[k].pit <= 0.5) {
   clouds.className = rainIcons[0] + " cloudicon";
  } else  {
   clouds.className = rainIcons[1] + " cloudicon";
  }

  var weatherText = document.createElement("span");
  weatherText.className = "weather-text";
  weatherText.innerHTML = cloudText[observations[k].tcc]+". "; //+ ". " + rainText[observations[k].pit / 2];

  if( observations[k].pit == 0) {
   weatherText.innerHTML += "<br>Ingen nederbörd";
  }
  else if( observations[k].pit > 0 && observations[k].pit <= 0.2) {
   weatherText.innerHTML += "<br>Lätt nederbörd<br>"+observations[k].pit+" mm/h";
  }
  else if( observations[k].pit > 0.2 && observations[k].pit <= 0.8) {
   weatherText.innerHTML += "<br>Nederbörd<br>"+observations[k].pit+" mm/h";
  }
  else if( observations[k].pit > 0.8) {
   weatherText.innerHTML += "<br>Kraftig Nederbörd<br>"+observations[k].pit+" mm/h";
  }

  observation.appendChild(weatherDate)
  observation.appendChild(clouds)
  observation.appendChild(weatherText)
  observation.appendChild(weatherTemp)
  observation.appendChild(windSpeed)
  observation.appendChild(windDirection)

  $(".weather-container").append(observation);
 }
 })
 } // End Get Weather
getWeather();

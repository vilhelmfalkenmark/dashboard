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
  var smhiRequest = "http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/59.32/lon/18.05/data.json";
  $(".weather-container").html("");
  $.ajax({
       type: "GET",
       url:  smhiRequest, // Stockholm Östra

       dataType: "JSON",
       // jsonpCallback: 'callback',
       success: function(json) {

        var today = new Date();
        // var res = $.getJSON(smhiRequest, function(json) {
          // console.log(json);
          var observations = [];
          var allObservations = json.timeseries;
          var limiter = 1;

          var numberOfObservation = 12;

          currentDay = today.getDate();

          var startIndex = 0;

          function findStartIndex() {
            for (var i = 0; i < allObservations.length; i++) {
              if (allObservations[i].validTime.substr(8, 2) == currentDay && allObservations[i].validTime.substr(11, 2) == today.getHours()) {
                startIndex = i;
                return false;
              }
            }
          }
          findStartIndex(); // Vi gör det till en funktion så att vi kan returnera false så att den inte behöver loopa igenom hela JSON objektet
          var timeSpan; // Vi vill ha alla prognoser de kommande 48 timmarna
          timeSpan = settings.intervalOfWeatherRapports * settings.numberofWeatherRapports;
          var interval = parseInt(settings.intervalOfWeatherRapports); // Se till att det är ett nummer!

          for (var j = startIndex; j < (timeSpan + startIndex); j += interval) {
            observations.push(allObservations[j])
          }
          var cloudIcons = ["flaticon-weather-1", "flaticon-weather-5", "flaticon-weather-4", "flaticon-weather-4",
            "flaticon-cloud", "flaticon-cloud", "flaticon-cloud-2", "flaticon-sky", "flaticon-sky", "flaticon-sky"];

          var rainIcons = ["flaticon-weather-3", "flaticon-cloud-1"];

          var cloudText = ["Klart", "Överlag klart", "Halvklart", "Lätt molnighet", "Lite moln", "Överlag molnigt", "Molnigt", "Mulet", "Mulet", "Kraftigt molntäcke"]

          for (var k = 0; k < observations.length; k++) {
            var observation = document.createElement("div");
            observation.className = "observation";

            var weatherDate = document.createElement("h4");
            var dayNumber = observations[k].validTime.substr(8, 2); // Exempelvis 19
            var monthNumber = observations[k].validTime.substr(5, 2); // Exempelvis 04 för April

            if (k == 0) {
              weatherDate.innerHTML = "Just nu";
            } else {
              if (dayNumber == currentDay) {
                weatherDate.innerHTML = "Idag <br>klockan " + observations[k].validTime.substr(11, 2);
              } else if (dayNumber == currentDay + 1) {
                weatherDate.innerHTML = "Imorgon <br>klockan " + observations[k].validTime.substr(11, 2);
              } else {
                if (monthNumber.charAt(0) == "0") {
                  weatherDate.innerHTML = dayNumber + "/" + monthNumber.substr(1, 1) + " <br>Klockan " + observations[k].validTime.substr(11, 2);
                } else {
                  weatherDate.innerHTML = dayNumber + "/" + monthNumber + " <br>Klockan " + observations[k].validTime.substr(11, 2);
                }
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

            var windIcon = document.createElement("i");
            windIcon.className = "fa fa-arrow-down";
            windIcon.style.transform = "rotate(" + observations[k].wd + "deg)";

            windDirection.appendChild(windIcon);

            var clouds = document.createElement("i");

            var weatherText = document.createElement("span");
            weatherText.className = "weather-text";
            weatherText.innerHTML = cloudText[observations[k].tcc] + ". " + observations[k].tcc + "/8"; //+ ". " + rainText[observations[k].pit / 2];

            if (observations[k].pit == 0) {
              clouds.className = cloudIcons[observations[k].tcc] + " cloudicon";
              weatherText.innerHTML += "<br>Ingen nederbörd";
            } else if (observations[k].pit > 0 && observations[k].pit <= 0.2) { // Lätt nederbörd
              weatherText.innerHTML += "<br>Lätt nederbörd<br>" + observations[k].pit + " mm/h";

              if (observations[k].tcc < 5) { // Hur ser molntäcket ut
                clouds.className = rainIcons[0] + " cloudicon";
              } else {
                clouds.className = rainIcons[1] + " cloudicon";
              }
            } else if (observations[k].pit > 0.2 && observations[k].pit <= 0.8) {
              weatherText.innerHTML += "<br>Måttlig Nederbörd<br>" + observations[k].pit + " mm/h";
              if (observations[k].tcc < 5) { // Hur ser molntäcket ut
                clouds.className = rainIcons[0] + " cloudicon";
              } else {
                clouds.className = rainIcons[1] + " cloudicon";
              }
            } else if (observations[k].pit > 0.8) {
              weatherText.innerHTML += "<br>Kraftig Nederbörd<br>" + observations[k].pit + " mm/h";
              clouds.className = rainIcons[1] + " cloudicon";
            }
            observation.appendChild(weatherDate)
            observation.appendChild(clouds)
            observation.appendChild(weatherText)
            observation.appendChild(weatherTemp)
            observation.appendChild(windSpeed)
            observation.appendChild(windDirection)
            $(".weather-container").append(observation);
          }
        },
        error: function() {
          console.log('Inget svar från SMHI API');
       }
     });
}

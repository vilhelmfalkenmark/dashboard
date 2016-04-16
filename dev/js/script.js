(function() {

 "use strict";
 $(document).ready(function() {
  /*###########################################
  ############################################
  KLOCKA
  ############################################
  ############################################*/
  var allDate = new Date();

  var weekDays = ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"];
  var months = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"];

  var currentWeekday = allDate.getDay();
  var currentDay = allDate.getDate();
  var currentMonth = allDate.getMonth();
  var currentYear = allDate.getFullYear();

  $(".date").html(weekDays[currentWeekday] + " " + currentDay + " " + months[currentMonth])

  function updateClock() {
   var allTime = new Date();
   var currentHour = allTime.getHours();
   var currentMinute = allTime.getMinutes();
   var currentSecond = allTime.getSeconds();
   currentMinute = (currentMinute < 10 ? "0" : "") + currentMinute;
   currentSecond = (currentSecond < 10 ? "0" : "") + currentSecond;
   $(".time").html(currentHour + ":" + currentMinute + ":" + currentSecond)
  }
  setInterval(function() {
   updateClock()
  }, 1000);

  // console.log(currentYear)
  // console.log(currentDay)
  // console.log(currentMonth)

  /*###########################################
  ############################################
  NAMNSDAGAR ETC.
  ############################################
  ############################################*/
  $.ajax({
   type: "GET",
   url: "http://api.dryg.net/dagar/v2.1/" + currentYear + "/" + (currentMonth + 1) + "/" + currentDay, // Chas
   dataType: "JSON",
   // jsonpCallback: 'callback',
   success: function(days) {
    var dateInfoContainer = document.getElementsByClassName('date-info')[0];
    var today = days.dagar[0]
    var weekNumber = document.createElement("p");
    weekNumber.innerText = "Vecka: " + today.vecka;
    dateInfoContainer.appendChild(weekNumber);
    for (var key in today) {
     if (key == "röd dag") {
      var redDay = document.createElement("p");
      redDay.innerText = "Röd dag: " + today[key];
      dateInfoContainer.appendChild(redDay);
     }
    }

    var nameDayArray = today.namnsdag;
    var nameDay;

    var nameDayContainer = document.createElement("p");
    nameDayContainer.innerText = "Namnsdag idag: "

    for (var i = 0; i < nameDayArray.length; i++) {
     nameDay = document.createElement("span");
     if (i == 0 && nameDayArray.length > 0) {
      nameDay.innerText = nameDayArray[i] + " & ";
     } else {
      nameDay.innerText = nameDayArray[i];
     }
     nameDayContainer.appendChild(nameDay)
    }
    dateInfoContainer.appendChild(nameDayContainer);
   },
   error: function() {
    console.log('Inget svar från Dagens API');
   }
  })
  /*###########################################
  ############################################
  GEOLOCATION KOORDINATER
  ############################################
  ############################################*/
  // var x = document.getElementById("demo");
  // function getLocation() {
  //     if (navigator.geolocation) {
  //         navigator.geolocation.getCurrentPosition(showPosition);
  //     } else {
  //         x.innerHTML = "Geolocation is not supported by this browser.";
  //     }
  // }
  // function showPosition(position) {
  //     x.innerHTML = "Latitude: " + position.coords.latitude +
  //     "<br>Longitude: " + position.coords.longitude;
  // }
  //  getLocation();

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

   function findWeather() {
    for (var i = 0; i < allObservations.length; i++) {
     if (allObservations[i].validTime.substr(8, 2) == currentDay && allObservations[i].validTime.substr(11, 2) == today.getHours()) {
      for (var j = 0; j <= 24; j += numberOfObservation) {
       observations.push(allObservations[i + j]);
      }
      return false;
     }
    }
   }
   findWeather();


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
    //
    // console.log(observations[k].validTime.substr(8,2))
    // console.log(currentDay+" är currentDay")

    if (observations[k].validTime.substr(8, 2) == currentDay) {
     weatherDate.innerHTML = "Idag klockan " + observations[k].validTime.substr(11, 2);
    } else if (observations[k].validTime.substr(8, 2) == currentDay + 1) {
     weatherDate.innerHTML = "Imorgon klockan " + observations[k].validTime.substr(11, 2);
    }
    // console.log(observations[k].validTime.substr(11,2));
   }

   // weatherDate.innerHTML = observations[k].validTime;

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

   if (observations[k].pit < 2) { // Om nederbörd är mindre än 2/8 visa ikon utan regn
    clouds.className = cloudIcons[observations[k].tcc] + " cloudicon";
   } else if (observations[k].pit >= 2 && observations[k].pit <= 5) {
    clouds.className = rainIcons[0] + " cloudicon";
   } else if (observations[k].pit > 5) {
    clouds.className = rainIcons[1] + " cloudicon";
   }

   var weatherText = document.createElement("span");
   weatherText.className = "weather-text";
   weatherText.innerHTML = cloudText[observations[k].tcc] + ". " + rainText[observations[k].pit / 2];

   observation.appendChild(weatherDate)
   observation.appendChild(clouds)
   observation.appendChild(weatherText)
   observation.appendChild(weatherTemp)
   observation.appendChild(windSpeed)
   observation.appendChild(windDirection)

   $(".weather-container").append(observation);
  }

 })

 /*###########################################
 ############################################
 RESEPLANERARE
 ############################################
 ###########################################*/

 $.ajax({
      type: "GET",
      // url:  "data.php?lat=59.3024216&long=18.1870591", // Chas
      // url:  "data.php?lat=59.3490464&long=18.065024", // Körsbärsvägen
      // url:  "data.php?lat=59.319600&long=18.072087", // Slussen
      url:  "data.php?lat=59.3458412&long=18.0649849", // Stockholm Östra

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
       findDuplicates();
      },
      error: function() {
       console.log('Inget svar från API');
      }
 });


 function findDuplicates() {
  var departureList = document.getElementsByClassName('departure-list');
  for (var h = 0; h < departureList.length; h++) {
   for (var l = 0; l < departureList.length; l++) {
    if (departureList[h].childElementCount == departureList[l].childElementCount && l != h) {
     // console.log(departureList[h].previousElementSibling.firstElementChild.innerText);
     // console.log(departureList[l].previousElementSibling.firstElementChild.innerText);
     if ((departureList[h].lastElementChild.innerHTML == departureList[l].lastElementChild.innerHTML) // Kolla att första barnet stämmer
     && (departureList[h].firstElementChild.innerHTML == departureList[l].firstElementChild.innerHTML) // Kolla att sista barnet stämmer
     && (departureList[h].previousElementSibling.firstElementChild.innerText == departureList[l].previousElementSibling.firstElementChild.innerText) // Kolla att rubriken för containern stämmer
     && (departureList[h].className === "departure-list") // Säkerställ att det inte läggs till två gånger.
    ) {
     departureList[l].className += " duplicate";
     departureList[l].parentNode.className += " duplicate-container";
    }
   }
  }
 }
}

/*###########################################
############################################
TWITTER
############################################
############################################*/

function urlify(text) {
 var urlRegex = /(https?:\/\/[^\s]+)/g;
 return text.replace(urlRegex, function(url) {
  return "<a href='" + url + "' class='twitter-link' target='_blank'>" + "Läs mer" + "</a>";
 })
}
function formatTwitterDate(date) {
 var dateSub = date.substr(0, 3);
 var month = date.substr(4, 3);
 var day = date.substr(8, 2);
 var time = date.substr(11, 5);
 if (dateSub == "Sat") {
  dateSub = "Lördag";
 } else if (dateSub == "Sun") {
  dateSub = "Söndag";
 } else if (dateSub == "Mon") {
  dateSub = "Måndag";
 } else if (dateSub == "Tue") {
  dateSub = "Tisdag";
 } else if (dateSub == "Wed") {
  dateSub = "Onsdag";
 } else if (dateSub == "Thu") {
  dateSub = "Torsdag";
 } else if (dateSub == "Fri") {
  dateSub = "Fredag";
 }
 return dateSub + " " + day + " " + month + " Klockan: " + time;
}

$.ajax({
 type: "GET",
 url: "twitter.php",
 dataType: "json",
 // jsonpCallback: 'callback',
 success: function(twitter) {
  // console.log(twitter);
  var twitterContainer = document.getElementsByClassName('twitter-container')[0];
  var tweetContainer;
  var tweetDate;
  var tweetContent;

  for (var t = 0; t < twitter.length; t++) {
   tweetContainer = document.createElement("div")
   tweetContainer.className = "tweet-container";
   tweetDate = document.createElement("p");
   tweetDate.className = "tweet-date";
   // tweetDate.innerText  = twitter[t].created_at.substr(0,16);
   tweetDate.innerText = formatTwitterDate(twitter[t].created_at);

   tweetContent = document.createElement("p");
   tweetContent.className = "tweet-content";
   tweetContent.innerHTML = urlify(twitter[t].text);

   tweetContainer.appendChild(tweetDate);
   tweetContainer.appendChild(tweetContent);
   twitterContainer.appendChild(tweetContainer);
  }
 },
 error: function() {
  console.log('Inget svar från Twitters API');
 }
})
}); // End  jQuery
})(); // End Iffe

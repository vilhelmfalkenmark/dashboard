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
      redDay.innerText = "Helgdag: " + today[key];
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

$(".toggle-settings").click(function(){
 $(".settings-container").toggleClass('open');
});

/*###########################################
 ############################################
       INSTÄLLNINGAR SOM ÄNDRAS OM NÅGON
       ÄR INLOGGAD.
 ############################################
 ############################################*/
var settings = {
 numberofCalenderActivities: 3,
 twitterAccount: "dagensnyheter",
 numberofTweets: 5,
 numberofWeatherRapports: 4,
 intervalOfWeatherRapports: 8,
 showDeparturesNow: false
};

function updateDOMData() {
getWeather();
getTwitterFeed();
// getGoogleCalender();
};



// emptyFeed()

var ref = new Firebase("https://vilhelmdashboard.firebaseio.com");
/*###########################################
 ############################################
 Skicka in inställningar
 ############################################
 ############################################*/
var defaultSettings = {
  numberofCalenderActivities: 3,
  twitterAccount: "dagensnyheter",
  numberofTweets: 5,
  numberofWeatherRapports: 5,
  intervalOfWeatherRapports: 6,
  showDeparturesNow: false
};
var user = ref.getAuth();
var userName = document.getElementsByClassName('user-name');
if (user != null) {
  for (var i = 0; i < userName.length; i++) {
    userName[i].innerHTML = "Inloggad som " + user.password.email;
  }
}
/*##########################################
############################################
	              Registrera
############################################
############################################*/
var explanation = document.getElementsByClassName('explaination')[0];
var signupButtons = document.getElementsByClassName('sign-up-btn');

signupButtons[1].addEventListener("click", function() {
  document.getElementsByClassName('settings-container')[0].classList.toggle("open");
  logInButtons[0].style.display = "none"; // Knappen i formulär ska visas.
  signupButtons[0].style.display = "block"; // Knappen i formulär ska visas.
});

function createNewUser(email, password) {
  ref.createUser({
      email: email,
      password: password
    },
    function(error, userData) {
      if (error) {
        // console.log("Error creating user:", error);
      } else {
        // console.log("Successfully created user account with uid:", userData.uid);
        ref.child("dashboardUsers").child(userData.uid).set(defaultSettings);
        logInUser(email, password, true);
      }
    });
}

signupButtons[0].addEventListener("click", function() {
    createNewUser(
      document.getElementsByClassName('user-email-adress')[0].value,
      document.getElementsByClassName('user-password')[0].value
    )
  })

/*###########################################
	############################################
													Logga in användare
############################################
############################################*/
var signinContainer = document.getElementsByClassName('sign-in-container');
var logInButtons = document.getElementsByClassName('log-in-btn'); // Logga in knappar i formulär och header

logInButtons[1].addEventListener("click", function() { // Knappen i headern
  document.getElementsByClassName('settings-container')[0].classList.toggle("open");
  logInButtons[0].style.display = "block"; // Knappen i formulär ska visas.
  signupButtons[0].style.display = "none"; // Knappen i formulär ska visas.
});
logInButtons[0].addEventListener("click", function() {
  var signinName = document.getElementsByClassName('user-email-adress')[0].value;
  var signinPassword = document.getElementsByClassName('user-password')[0].value;
  logInUser(signinName, signinPassword, false);
});
function logInUser(email, password, newUser) { // Om newUser är true så är det en ny användare som auto-loggas in.

  showThis("toggle-settings");
  if (newUser) {
    explanation.innerHTML = "Tack för att du registerat dig! Vi har fyllt i lite förslag på hur appen ska sättas upp. Välkommen att ändra efter eget huvud!";
  } else {
    explanation.innerHTML = "";
    document.getElementsByClassName('settings-container')[0].classList.toggle("open");
  }
  ref.authWithPassword({
    email: email,
    password: password
  }, function(error, authData) {
    if (error) {
      // console.log("Login Failed!", error);
    } else {
      // console.log("Authenticated successfully with payload:", authData);
      for (var i = 0; i < userName.length; i++) {
        userName[i].innerHTML = "Inloggad som " + authData.password.email
      }
      showThis('user-settings-container');
      hideThis('sign-in-container');
      console.log("Nu är vi inloggad!");
      // showData(); // VISA ANVÄNDARENS DATA

      /* START TEST */
      var database = ref;
      user = ref.getAuth();
      database.on("value", function(snapshot) {
          // console.log("database.on(value, kallad! från test");
          var readableDB = snapshot.val(); // readableDB är alltså en läsbar snapshot på vår databas.
          // if(user) { // Om någon är inloggad
           for (var key in readableDB.dashboardUsers) {
             if (key == user.uid) {
               /* === SKRIV UT RÄTT VÄRDEN I FÄLTEN ==== */
               googleAmount.value = readableDB.dashboardUsers[key].numberofCalenderActivities;
               twitterFollow.value = readableDB.dashboardUsers[key].twitterAccount;
               twitterAmount.value = readableDB.dashboardUsers[key].numberofTweets;
               weatherAmount.value = readableDB.dashboardUsers[key].numberofWeatherRapports;
               weatherInterval.value = readableDB.dashboardUsers[key].intervalOfWeatherRapports;
               showCloseDepartures.checked = readableDB.dashboardUsers[key].showDeparturesNow;
               showCloseDepartures.checked == true ? showCloseText.innerHTML = "Ja" : showCloseText.innerHTML = "Nej";
               settings = {
                 numberofCalenderActivities: readableDB.dashboardUsers[key].numberofCalenderActivities,
                 twitterAccount: readableDB.dashboardUsers[key].twitterAccount,
                 numberofTweets: readableDB.dashboardUsers[key].numberofTweets,
                 numberofWeatherRapports: readableDB.dashboardUsers[key].numberofWeatherRapports,
                 intervalOfWeatherRapports: readableDB.dashboardUsers[key].intervalOfWeatherRapports,
                 showDeparturesNow: readableDB.dashboardUsers[key].showDeparturesNow
                }
                updateDOMData();
               return false; // Sluta loopa
              }
           }
        },
        function(errorObject) {
          // console.log("The read failed: " + errorObject.code);
        });
      /* SLUT TEST */
    }
  });
}
/*###########################################
 ############################################
 Kolla om någon är inloggad
 ############################################
 ############################################*/
function authDataCallback(authData) {
  if (authData) { // INLOGGAD
    // console.log("User " + authData.uid + " is logged in with " + authData.provider);

    showThis('user-settings-container');
    showThis('header-out-container');
    showThis('toggle-settings');
    hideThis('sign-in-container');
    hideThis('header-in-container');

  } else { // EJ INLOGGAD
    showThis('header-in-container');
    showThis('sign-in-container');
    hideThis('header-out-container');
    // updateDOMData()

  }
}
ref.onAuth(authDataCallback);
/*###########################################
 ############################################
 Logga ut användare
 ############################################
 ############################################*/

var logOutBtn = document.getElementsByClassName('log-out-btn')
for (var i = 0; i < logOutBtn.length; i++) {
  logOutBtn[i].addEventListener("click", logOut);
}
function logOut() {
  userName[0].innerHTML = "";

  showThis('sign-in-container');
  hideThis('toggle-settings');
  hideThis('user-settings-container');
  ref.unauth();
  clearData();
   settings = {
   numberofCalenderActivities: 3,
   twitterAccount: "dagensnyheter",
   numberofTweets: 5,
   numberofWeatherRapports: 4,
   intervalOfWeatherRapports: 8,
   showDeparturesNow: false
  };
  updateDOMData(); //
}

/*###########################################
 ############################################
	HANTERA FORMULÄRDATA
 ############################################
 ############################################*/

var googleAmount = document.getElementById('google-cal-amount');
var twitterFollow = document.getElementById('twitter-follow');
var twitterAmount = document.getElementById('twitter-posts-amount');
var weatherAmount = document.getElementById('weather-rapport-amount');
var weatherInterval = document.getElementById('weather-rapport-interval');
var showCloseDepartures = document.getElementById('show-close-departures-now');
var showCloseText = document.getElementById('load-close-departures-now');

showCloseDepartures.addEventListener("click", function() {
  this.checked == true ? showCloseText.innerHTML = "Ja" : showCloseText.innerHTML = "Nej";
});

/* UPPDATERING AV FORMULÄRET */

var submitBtn = document.getElementById('submit-btn');
submitBtn.addEventListener("click", updateInfo);
function updateInfo() {

  ref.child('dashboardUsers').child(ref.getAuth().uid).update({
    numberofCalenderActivities: isNumber(googleAmount.value),
    twitterAccount: twitterFollow.value,
    numberofTweets: isNumber(twitterAmount.value),
    numberofWeatherRapports: isNumber(weatherAmount.value),
    intervalOfWeatherRapports: isNumber(weatherInterval.value),
    showDeparturesNow: showCloseDepartures.checked
  });
  // showData();
}
function isNumber(number) { // Validera besökaren faktiskt skickar in ett nummer.
  if (isNaN(number) == false) {
    return number
  } else {
    return "1";
  }
}
// function showData() { // VISA ANVÄNDARENS SATTA DATA I INPUTFÄLTEN
   // console.log("showdata kallad på");
  var database = ref;
  user = ref.getAuth();
  database.on("value", function(snapshot) {
      // console.log("database.on(value, kallad!");
      var readableDB = snapshot.val(); // readableDB är alltså en läsbar snapshot på vår databas.
      if(user) { // Om någon är inloggad
       for (var key in readableDB.dashboardUsers) {
         if (key == user.uid) {
 										/* === SKRIV UT RÄTT VÄRDEN I FÄLTEN ==== */
 										googleAmount.value = readableDB.dashboardUsers[key].numberofCalenderActivities;
           twitterFollow.value = readableDB.dashboardUsers[key].twitterAccount;
           twitterAmount.value = readableDB.dashboardUsers[key].numberofTweets;
           // weatherAmount.value = 5;
           // weatherInterval.value = 8;
           // // console.log(weatherInterval.value+" är value");
           weatherAmount.value = readableDB.dashboardUsers[key].numberofWeatherRapports;
           weatherInterval.value = readableDB.dashboardUsers[key].intervalOfWeatherRapports;
           showCloseDepartures.checked = readableDB.dashboardUsers[key].showDeparturesNow;
           showCloseDepartures.checked == true ? showCloseText.innerHTML = "Ja" : showCloseText.innerHTML = "Nej";

            settings = {
             numberofCalenderActivities: readableDB.dashboardUsers[key].numberofCalenderActivities,
             twitterAccount: readableDB.dashboardUsers[key].twitterAccount,
             numberofTweets: readableDB.dashboardUsers[key].numberofTweets,
             numberofWeatherRapports: readableDB.dashboardUsers[key].numberofWeatherRapports,
             intervalOfWeatherRapports: readableDB.dashboardUsers[key].intervalOfWeatherRapports,
             showDeparturesNow: readableDB.dashboardUsers[key].showDeparturesNow
            }
            console.log(settings);
            // console.log("updateDOMData(); kallad från On value");
            updateDOMData();
          	return false; // Sluta loopa
 									}
       }
      }
      else {
       // console.log("Ingen inloggad!");
       updateDOMData();
      }

    },
    function(errorObject) {
      // console.log("The read failed: " + errorObject.code);
    });
// }
function clearData() { // Exempelvis när någon loggar ut
  googleAmount.value = "";
  twitterFollow.value = "";
  twitterAmount.value = "";
  weatherAmount.value = "";
  weatherInterval.value = "";
  showCloseDepartures.checked = false;
  showCloseText.innerHTML = "Nej";
}







/*###########################################
 ############################################
	FUNKTIONER FÖR ATT VISA OCH DÖLJA SAKER SOM
	ÄR DE FÖRSTA MED SINA	KLASSNAMN.
 ############################################
 ############################################*/
function showThis(element) {
  document.getElementsByClassName(element)[0].style.display = "block";
}

function hideThis(element) {
  document.getElementsByClassName(element)[0].style.display = "none";
}

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

     // findCloseDepartures(lat,long);
 }
  // getLocation();

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

/*###########################################
############################################
           SECTION RESEPLANERARE
############################################
###########################################*/
var loop;

function writeDepartures(response) {

 // console.log(response.length);

  if(response.constructor === Array ) { // Om vi tar emot flera stationer dvs. en array av objekt.
   for (var i = 0; i < response.length; i++) {
      console.log("Kommer in här också!");
      loopStationObject(i,true); // True innebär att det är en Array som kommer in med flera avgångar
      var distance = document.createElement("span");
      distance.innerHTML = response[i].distance;
  }
  }
  else { // Vi tar bara emot en station dvs. ett objekt
   loopStationObject(0,false); // False innebär att det är en Array som kommer in med flera avgångar
  }

    function loopStationObject(i,multipleStations) {
     if (multipleStations) {
       loop = response[i];
     }
     else {
      loop = response;
     }
    for (var key in loop.ResponseData) {
      if(loop.ResponseData[key].constructor === Array && loop.ResponseData[key].length > 0 &&
       ((key == "Trams") || (key == "Metros") || (key == "Buses") || (key == "Ships"))
      )
      {
        var stationContainer = document.createElement("div");

        if(multipleStations) {
         stationContainer.className = "station-container";
        }
        else {
         stationContainer.className = "station-container-open";
        }


        var stationName = document.createElement("span")
        stationName.className = "station-name";
        stationName.innerText = loop.ResponseData[key][0].StopAreaName+" ";

         var distance = document.createElement("span")

         if(multipleStations) {
          distance.className = "distance-to-station";
          distance.innerText = loop.distance+" meter ";
          distance.innerText = " meter ";
         }


        var stationId = document.createElement("span");
        stationId.innerText = loop.ResponseData[key][0].SiteId;

        var stationNameHeader = document.createElement("h3");

        stationNameHeader.appendChild(stationName)
        stationNameHeader.appendChild(distance)
        stationNameHeader.appendChild(stationId)

        stationContainer.appendChild(stationNameHeader)

        var ul = document.createElement("ul");

        if(multipleStations) {
         ul.className = "departure-list";
        }
        else {
         ul.className = "departure-list-open";
        }


        for (var k = 0; k < loop.ResponseData[key].length; k++) {

         var li = document.createElement("li");

         var lineNumber = document.createElement("span");
         lineNumber.innerHTML = loop.ResponseData[key][k].LineNumber+" ";

         var transportMode = document.createElement("span");
         if(loop.ResponseData[key][k].TransportMode == "BUS") {
          transportMode.innerHTML = "Buss ";
         }
         else if(loop.ResponseData[key][k].TransportMode == "METRO") {
          transportMode.innerHTML = "Tunnelbana ";
         }
         else if(loop.ResponseData[key][k].TransportMode == "TRAM") {
          transportMode.innerHTML = "Lokalbana ";
         }
         else if(loop.ResponseData[key][k].TransportMode == "BOAT") {
          transportMode.innerHTML = "Båt ";
         }

         var destination = document.createElement("span");
         destination.innerHTML = loop.ResponseData[key][k].Destination+" ";

         var displayTime = document.createElement("span");
         displayTime.innerHTML = loop.ResponseData[key][k].DisplayTime;

        li.appendChild(transportMode)
        li.appendChild(lineNumber)
        li.appendChild(destination)
        li.appendChild(displayTime)
        ul.appendChild(li);
        }
        stationContainer.appendChild(ul);
      }
      $(".public-transport-container").append(stationContainer);
    }
 }



}

var modalOpen;
$(".find-close-departures").click(function() {
  findCloseDepartures("59.319600","18.072087");
});

function findCloseDepartures(lat,long) {
 $(".loader").show();
 $(".public-transport-container").html("");

$.ajax({
     type: "GET",
     // url:  "data.php?lat=59.3024216&long=18.1870591", // Chas
     // url:  "data.php?lat=59.3490464&long=18.065024", // Körsbärsvägen
     // url:  "data.php?lat=59.319600&long=18.072087", // Slussen
     url:  "data.php?lat="+lat+"&+long="+long, // Stockholm Östra

     dataType: "JSON",
     // jsonpCallback: 'callback',
     success: function(response) {
       // console.log(response);
       writeDepartures(response)

      // findDuplicates();

     /*###########################################
      ############################################
              ESCAPE TRYCK VID ÖPPEN MODAL
      ############################################
      ############################################*/
      var tabIndex = 0;
      modalOpen = false;
      $( ".duplicate-container" ).remove(); // TA BORT ALLA DUBLETTER UR DOMET.

      var allStationContainers = document.getElementsByClassName('station-container');
      var stationLength = allStationContainers.length-1;

     $('body').keydown(function(key) {
         if (key.keyCode == 27) {
          // $(".modal-container").css({
          //  "opacity":0
          // })
          // setTimeout(function() {
          //     $(".modal-container").css({
          //      "display":"none"
          //     })
          //   }, 200);
          closeModal();
         }

         else if (key.keyCode == 39) {
          if(modalOpen) {
           tabIndex == stationLength ? tabIndex = 0 : tabIndex++;
           $(".modal-inner").html("<div class='flex-center'><div>"+allStationContainers[tabIndex].innerHTML+"</div></div>")
          }
         }
         else if (key.keyCode == 37) {
          if(modalOpen) {
           tabIndex == 0 ? tabIndex = stationLength: tabIndex--;
           $(".modal-inner").html("<div class='flex-center'><div>"+allStationContainers[tabIndex].innerHTML+"</div></div>")
          }
         }
     });

     /*###########################################
      ############################################
          ÖPPNA MODAL OCH SKICKA IN AVGÅNGAR
      ############################################
      ############################################*/
     $(".station-container").click(function() {
      $(".modal-container").css({
       "visibility":"visible",
        "opacity":1
      })
      modalOpen = true;
      tabIndex = $(this).index();
      $(".modal-inner").html("<div>"+allStationContainers[tabIndex].innerHTML+"</div>")
     });

     $( ".departure-list" ).each(function( ) {
        $(this).parent().append("<div class='number-of-departures'>Visa alla "+this.children.length+" avgångar.</div>")
    });
    $(".loader").hide();
   }, // END SUCCESS
     error: function() {
      console.log('Inget svar från API');
     }
});
}
// function findDuplicates() {
//  var departureList = document.getElementsByClassName('departure-list');
//  for (var h = 0; h < departureList.length; h++) {
//   for (var l = 0; l < departureList.length; l++) {
//    if (departureList[h].childElementCount == departureList[l].childElementCount && l != h) {
//     // console.log(departureList[h].previousElementSibling.firstElementChild.innerText);
//     // console.log(departureList[l].previousElementSibling.firstElementChild.innerText);
//     if ((departureList[h].lastElementChild.innerHTML == departureList[l].lastElementChild.innerHTML) // Kolla att första barnet stämmer
//     && (departureList[h].firstElementChild.innerHTML == departureList[l].firstElementChild.innerHTML) // Kolla att sista barnet stämmer
//     && (departureList[h].previousElementSibling.firstElementChild.innerText == departureList[l].previousElementSibling.firstElementChild.innerText) // Kolla att rubriken för containern stämmer
//     && (departureList[h].className === "departure-list") // Säkerställ att det inte läggs till två gånger.
//    ) {
//     departureList[l].className += " duplicate";
//     departureList[l].parentNode.className += " duplicate-container";
//    }
//   }
//  }
// } // End findDuplicates
// } // End findDuplicates

/*###########################################
 ############################################
          HITTA SPECIFIK STATION
 ############################################
 ############################################*/

function addSearchToModal (inputID, inputPlaceholder, searchID, searchBtnText,modalheader) {

 var modalInner = document.getElementsByClassName('modal-inner')[0];
 modalInner.innerHTML = ""; // Så att modalen är tom från tidigare klick

 var modalSearchContainer = document.createElement("div");
 modalSearchContainer.className = "modal-search";

 var modalHeader = document.createElement("h3");
 modalHeader.innerText = modalheader;


 var modalInput = document.createElement("input");
 modalInput.setAttribute("type", "text");
 modalInput.id = inputID;
 modalInput.setAttribute("placeholder", inputPlaceholder);

 var modalSearchBtn = document.createElement("button");
 modalSearchBtn.id = searchID;
 modalSearchBtn.innerText = searchBtnText;

 modalSearchContainer.appendChild(modalHeader)
 modalSearchContainer.appendChild(modalInput)
 modalSearchContainer.appendChild(modalSearchBtn)
 modalInner.appendChild(modalSearchContainer)
};

var stationSearch;

$(".find-specific-departures").click(function() {
 modalOpen = true;
 addSearchToModal("station-name","Skriv namn på station","station-search","Sök resa","Sök resa med SL")
  $(".modal-container").css({
   "visibility":"visible",
    "opacity":1
  })
  // stationName = $("#station-name");
  stationSearch = document.getElementById('station-search');
  stationSearch.addEventListener("click",searchSpecificStation);
});

function searchSpecificStation() {
 var stationName = document.getElementById('station-name').value;
 $(".public-transport-container").html(""); // Töm eventuella tidigare resultat.

 $(".modal-inner").append($(".loader"));

 if(stationName != "")
 {
  $.ajax({
       type: "GET",
       url:  "searchstation.php?stationname="+stationName, // Stockholm Östra
       dataType: "JSON",
       success: function(station) {
         $(".modal-inner.loader").remove();
         closeModal();
         writeDepartures(station)
       }, // END SUCCESS
       error: function() {
        console.log('Inget svar från API hitta station');
       }
      });
 }
}
// searchSpecificStation();
/*###########################################
 ############################################
                 STÄNG MODAL
 ############################################
 ############################################*/


function closeModal() {
 console.log("Close modal kallad!");
 modalOpen = false;

 $(".modal-container").css({
  "opacity":0
 })
 setTimeout(function() {
     $(".modal-container").css({
      "visibility":"hidden"
     })
   }, 200);
}
 $(".close-modal-btn").click(function(){
 closeModal();
});
$('body').keydown(function(e) {
    if(modalOpen == true) {
    if (e.keyCode == 27) {
     closeModal();
    }
}
});

/*###########################################
############################################
           SECTION TWITTER
############################################
############################################*/
function getTwitterFeed() {
 $(".twitter-container").html("");

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
$(".twitter-account").html(settings.twitterAccount);

$.ajax({
 type: "GET",
 url: "twitter.php?twitterAccount="+settings.twitterAccount+"&numberofTweets="+settings.numberofTweets,
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
   tweetDate.innerText = formatTwitterDate(twitter[t].created_at);

   tweetContent = document.createElement("p");
   tweetContent.className = "tweet-content";
   tweetContent.innerHTML = urlify(twitter[t].text);

   tweetContainer.appendChild(tweetDate);
   tweetContainer.appendChild(tweetContent);
   twitterContainer.appendChild(tweetContainer);
  }

  $(".tweet-container").each(function() {
   $(this).find(".twitter-link").wrapAll( "<div class='twitter-link-container'></div>" );
  })

 },
 error: function() {
  $(".twitter-container").html("Inget svar från Twitters API");

  console.log('Inget svar från Twitters API');
 }
})
} // End get Twitterfeed;




});// End $(document).ready
})();// End iffe

/*###########################################
 ############################################
 SECTION GOOGLE CALENDER -- LAST SECTION
 ############################################
 ############################################*/

// function getGoogleCalender() {
 console.log("getGoogleCalender kallad");
var CLIENT_ID = '765342006289-i5i1df5rcv6sg6vh4ejm30f9lm1tjrhc.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  gapi.auth.authorize({
    'client_id': CLIENT_ID,
    'scope': SCOPES.join(' '),
    'immediate': true
  }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    loadCalendarApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'block';
  }
}
/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize({
      client_id: CLIENT_ID,
      scope: SCOPES,
      immediate: false
    },
    handleAuthResult);
  return false;
}
/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi() {

  gapi.client.load('calendar', 'v3', listUpcomingEvents);
}
/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */

// console.log(settings);

function listUpcomingEvents() {

  var request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 5,
    'orderBy': 'startTime'
  });

  request.execute(function(resp) {
    var events = resp.items;

    appendPre('Kommande saker i din kalender:');

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];

        var when = event.start.dateTime;
        // when = "<span>"+when+"</span>";
        // whenSpan.innerText = event.start.dateTime;

        if (!when) {
          when = event.start.date;
          // when = "<span>"+when+"</span>";

        }
        appendPre(event.summary, when, events.length);
      }
    } else {
      appendPre('Du ingenting i din kalender');
    }

  });
}
// listUpcomingEvents();
/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */

var counter = 0;

function appendPre(event, when, numberofActivities) {
  var calender = document.getElementsByClassName('calender')[0];

  var activity = document.createElement("li");
  activity.className = "calender-activity";
  // activity.innerText = event;

  activitySpan = document.createElement("span");
  activitySpan.className = "the-activity";
  activitySpan.innerText = event;

  var whenSpan = document.createElement("div");
  whenSpan.className = "activity-date format-date";
  whenSpan.innerText = when;

  if (counter > 0) // Rubriken "Min kalender" ska inte ha ett datum.
  {
   activity.appendChild(whenSpan);
  }
  activity.appendChild(activitySpan);
  calender.appendChild(activity);

  if (counter == numberofActivities) {
     formatDate();
  }
  counter++;
}

/*###########################################
 ############################################
                  Format-date
 ############################################
 ############################################*/
var day;
var month;
var year;
var time;
var dateString;
var weekDay;

var weekDays = ["söndag","måndag","tisdag","onsdag","torsdag","fredag","lördag"];
var months = ["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"];

function formatDate() {
 var today = document.getElementsByClassName('date')[0].innerText.toLowerCase();
  var formatDate = document.getElementsByClassName("format-date");
  for (var l = 0; l < formatDate.length; l++) {
   dateString = formatDate[l].innerText.substr(0,10);
   formatDate[l].innerText = formatDate[l].innerText.replace("-","");
   formatDate[l].innerText = formatDate[l].innerText.replace("-","");
   formatDate[l].innerText = formatDate[l].innerText.replace("T","");

   day = formatDate[l].innerText.substr(6,2);
   month = formatDate[l].innerText.substr(4,2);
   year = formatDate[l].innerText.substr(0,4);
   time = formatDate[l].innerText.substr(8,5);
   weekDay = weekDays[new Date(dateString).getDay()];
   weekDay = weekDay.substr(0,3);

   if(time.length > 0) {
    if((weekDay == today.substr(0,3)) && (day == today.substr(7,2)) && (months[month-1] ==  today.substr(10,5)))
    {
     formatDate[l].innerHTML = "<div class='calender-date'>IDAG</div>"+"<div class='time-span'>Kl: "+time+"</div>";
    }
    else {
     formatDate[l].innerHTML = "<div class='calender-date'>"+weekDay+" "+day+" "+months[month-1]+"</div>"+"<div class='time-span'>Kl: "+time+"</div>";
    }
   }
   else {
    if((weekDay == today.substr(0,3)) && (day == today.substr(7,2)) && (months[month-1] ==  today.substr(10,5)))
    {
     formatDate[l].innerHTML = "<div class='calender-date'>IDAG</div>"+"<div class='time-span'>Heldag</div>";
    }
    else {
     formatDate[l].innerHTML = "<div class='calender-date'>"+weekDay+" "+day+" "+months[month-1]+"</div>"+"<div class='time-span'>Heldag</div>";
    }
   }
  }
}
// } // End getGoogleCalender
// getGoogleCalender();

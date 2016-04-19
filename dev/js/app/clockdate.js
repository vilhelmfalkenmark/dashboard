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

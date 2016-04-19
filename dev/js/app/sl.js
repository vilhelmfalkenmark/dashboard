/*###########################################
############################################
           SECTION RESEPLANERARE
############################################
###########################################*/

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
       console.log(response);


      for (var i = 0; i < response.length; i++) {

         var distance = document.createElement("span");
         distance.innerHTML = response[i].distance;
         for (var key in response[i].ResponseData) {
           if(response[i].ResponseData[key].constructor === Array && response[i].ResponseData[key].length > 0 &&
            ((key == "Trams") || (key == "Metros") || (key == "Buses") || (key == "Ships"))
           )
           {
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

     $('body').keydown(function(e) {
         if (e.keyCode == 27) {
          $(".modal-container").css({
           "opacity":0
          })
          setTimeout(function() {
              $(".modal-container").css({
               "display":"none"
              })
            }, 200);
         }

         else if (e.keyCode == 39) {

          if(modalOpen) {
           tabIndex == stationLength ? tabIndex = 0 : tabIndex++;
           $(".modal-inner").html("<div class='flex-center'><div>"+allStationContainers[tabIndex].innerHTML+"</div></div>")
          }
         }
         else if (e.keyCode == 37) {
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
       "display":"block",
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
} // End findDuplicates
} // End findCloseDepartures

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
   "display":"block",
    "opacity":1
  })
  // stationName = $("#station-name");
  stationSearch = document.getElementById('station-search');
  stationSearch.addEventListener("click",searchSpecificStation);
});

function searchSpecificStation() {
 var stationName = document.getElementById('station-name').value;

 if(stationName != "")
 {
  $.ajax({
       type: "GET",
       url:  "searchstation.php?stationname="+stationName, // Stockholm Östra
       dataType: "JSON",
       success: function(station) {
         console.log(station)


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
 $(".close-modal-btn").click(function(){
 modalOpen = false;
 $(".modal-container").css({
  "opacity":0
 })

 setTimeout(function() {
     $(".modal-container").css({
      "display":"none"
     })
   }, 200);
});

$('body').keydown(function(e) {
    if(modalOpen == true) {
    if (e.keyCode == 27) {
     $(".modal-container").css({
      "opacity":0
     })
     setTimeout(function() {
         $(".modal-container").css({
          "display":"none"
         })
       }, 200);
    }
}
});

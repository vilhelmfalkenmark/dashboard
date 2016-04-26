/*###########################################
############################################
           SECTION RESEPLANERARE
############################################
###########################################*/
var loop;

function writeDepartures(response) {
  if(response.constructor === Array ) { // Om vi tar emot flera stationer dvs. en array av objekt.
   for (var i = 0; i < response.length; i++) {
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
          distance.innerText = loop.distance+" meter";
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

function checkIfShowNow() {
 if(settings.showDeparturesNow == true )
 {
  $(".loader").show();
  getLocation();
  // findCloseDepartures("59.319600","18.072087");
 }
}
checkIfShowNow();

$(".find-close-departures").click(function() {
 $(".loader").show();
 getLocation();
  // findCloseDepartures("59.319600","18.072087");
});


function findCloseDepartures(lat,long) {
 $(".public-transport-container").html("");

$.ajax({
     type: "GET",
     url:  "closedepartures.php?lat="+lat+"&+long="+long,
     dataType: "JSON",
     success: function(response) {
       // console.log(response);
       writeDepartures(response)
     /*###########################################
      ############################################
             ESCAPE TRYCK VID ÖPPEN MODAL
             OCH TOGGLA MELLAN AVGÅNGAR
      ############################################
      ############################################*/
      var tabIndex = 0;
      modalOpen = false;
      $( ".duplicate-container" ).remove(); // TA BORT ALLA DUBLETTER UR DOMET.

      var allStationContainers = document.getElementsByClassName('station-container');
      var stationLength = allStationContainers.length-1;

     $('body').keydown(function(key) {
         if (key.keyCode == 27) {
          closeModal();
         }
         else if (key.keyCode == 39) {
          if(modalOpen) {
           tabIndex == stationLength ? tabIndex = 0 : tabIndex++;
           $(".modal-inner").html("<div class='flex-center'><div class='modal-inner-div'>"+allStationContainers[tabIndex].innerHTML+"</div></div>")
          }
         }
         else if (key.keyCode == 37) {
          if(modalOpen) {
           tabIndex == 0 ? tabIndex = stationLength: tabIndex--;
           $(".modal-inner").html("<div class='flex-center'><div class='modal-inner-div'>"+allStationContainers[tabIndex].innerHTML+"</div></div>")
          }
         }
     });

     $(".modal-left-arrow").click(function() {
      if(modalOpen) {
       tabIndex == 0 ? tabIndex = stationLength: tabIndex--;
       $(".modal-inner").html("<div class='flex-center'><div class='modal-inner-div'>"+allStationContainers[tabIndex].innerHTML+"</div></div>")
      }
     });
     $(".modal-right-arrow").click(function() {
      if(modalOpen) {
       tabIndex == stationLength ? tabIndex = 0 : tabIndex++;
       $(".modal-inner").html("<div class='flex-center'><div class='modal-inner-div'>"+allStationContainers[tabIndex].innerHTML+"</div></div>")
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
      $(".modal-container").addClass("modal-with-arrows");
      modalOpen = true;
      tabIndex = $(this).index();
      $(".modal-inner").html("<div class='flex-center'><div class='modal-inner-div'>"+allStationContainers[tabIndex].innerHTML+"</div></div>")
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

 var modalLoader = $(".loader").clone();
 $(".modal-inner").append(modalLoader);

 if(stationName != "")
 {
  $.ajax({
       type: "GET",
       url:  "searchstation.php?stationname="+stationName, // Stockholm Östra
       dataType: "JSON",
       success: function(station) {
         $(".modal-inner.loader").css({
          "display":"none"
         })
         closeModal();
         writeDepartures(station)
       }, // END SUCCESS
       error: function() {
        // console.log('Inget svar från API hitta station');
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
 // console.log("Close modal kallad!");
 modalOpen = false;
 $(".modal-container").css({
  "opacity":0
 })
 $(".modal-container").removeClass("modal-with-arrows");
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

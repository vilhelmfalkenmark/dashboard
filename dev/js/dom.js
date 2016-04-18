(function() {
 "use strict";
 $(document).ready(function() {
  /*###########################################
   ############################################
            PRESS ESCAPE ON OPEN MODAL
   ############################################
   ############################################*/
   var tabIndex = 0;
   var modalOpen = false;
   $( ".duplicate-container" ).remove(); // TA BORT ALLA DUBLETTER UR DOMET.

   var allStationContainers = document.getElementsByClassName('station-container');
   var stationLength = allStationContainers.length-1;
   console.log(stationLength);

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
        // tabIndex++;
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
       OPEN MODAL AND PASS DEPARTURES
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

  /*###########################################
   ############################################
                   CLOSE MODAL
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

  $( ".departure-list" ).each(function( ) {
     $(this).parent().append("<div class='number-of-departures'>Visa alla "+this.children.length+" avgångar.</div>")
     // $(this).parent().append("<span >Den här har index "+ $(this).parent().index()+"</span>")
 });




 //  $(".station-container").click(function(){
 //   $(this).toggleClass("open-station-container");
 //  });
 //
 //  $( ".departure-list" ).each(function( ) {
 //    console.log(this.children.length);
 //    if(this.children.length > 3 )
 //    {
 //     $(this).parent().append("<div class='number-of-departures'>Visa alla "+this.children.length+" avgångar.</div>")
 //    }
 // });

 });

 })();

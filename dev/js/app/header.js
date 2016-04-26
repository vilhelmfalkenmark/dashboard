$(".toggle-settings").click(function(){
 $(".settings-container").toggleClass('open');
 if($(".settings-container").hasClass("open")) {
  $(".settings-text").html("Stäng")
 }
 else {
  $(".settings-text").html("Öppna")
 }
});
$("#submit-btn").click(function() { // RENT UX
 $(".submit-btn-save-todb").fadeIn( 300 ).delay( 800 ).fadeOut( 400 );
 $(".save-loader").fadeIn( 300 ).delay( 800 ).fadeOut( 400 );
 $(".submit-btn-save").fadeOut( 300 ).delay( 800 ).fadeIn( 400 );
});

$(".close-settings-btn").click(function() {

$(".settings-container").removeClass("open");
if($(".settings-container").hasClass("open")) {
 $(".settings-text").html("Stäng")
}
else {
 $(".settings-text").html("Öppna")
}
});

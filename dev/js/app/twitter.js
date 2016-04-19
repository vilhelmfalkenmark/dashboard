/*###########################################
############################################
           SECTION TWITTER
############################################
############################################*/


function getTwitterFeed() {
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

  $(".tweet-container").each(function() {
   $(this).find(".twitter-link").wrapAll( "<div class='twitter-link-container'></div>" );
  })

 },
 error: function() {
  console.log('Inget svar från Twitters API');
 }
})
} // End get Twitterfeed;

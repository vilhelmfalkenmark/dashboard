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

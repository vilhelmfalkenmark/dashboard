/*###########################################
 ############################################
       INSTÄLLNINGAR SOM ÄNDRAS OM NÅGON
       ÄR INLOGGAD.
 ############################################
 ############################################*/
window.settings = {
 numberofCalenderActivities: 3,
 twitterAccount: "dagensnyheter",
 numberofTweets: 5,
 numberofWeatherRapports: 4,
 intervalOfWeatherRapports: 8,
 showDeparturesNow: false
};

function updateDOMData(source) {
// console.log("updateDOMData kallad från "+source);
getWeather();
getTwitterFeed();
checkIfShowNow()
};

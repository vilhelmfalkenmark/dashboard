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
var googleAmount = document.getElementById('google-cal-amount');
var twitterFollow = document.getElementById('twitter-follow');
var twitterAmount = document.getElementById('twitter-posts-amount');
var weatherAmount = document.getElementById('weather-rapport-amount');
var weatherInterval = document.getElementById('weather-rapport-interval');
var showCloseDepartures = document.getElementById('show-close-departures-now');
var showCloseText = document.getElementById('load-close-departures-now');
var setter = 0;

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
  // document.getElementsByClassName('settings-container')[0].classList.toggle("open");
  document.getElementsByClassName('settings-container')[0].className = "settings-container open";
  logInButtons[0].style.display = "none"; // Knappen i formulär ska visas.
  signupButtons[0].style.display = "block"; // Knappen i formulär ska visas.
  $(".error-message").html("");

});

function createNewUser(email, password) {
  ref.createUser({
      email: email,
      password: password
    },
    function(error, userData) {
      if (error) {

       $(".error-message").html("Användarnamnet är upptaget eller felaktigt angivet")

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
  // document.getElementsByClassName('settings-container')[0].classList.toggle("open");
  document.getElementsByClassName('settings-container')[0].className = "settings-container open";
  logInButtons[0].style.display = "block"; // Knappen i formulär ska visas.
  signupButtons[0].style.display = "none"; // Knappen i formulär ska visas.
  $(".error-message").html("");

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
     // $(".weather-container").html("");
     // $(".twitter-container").html("");
  } else {
    // updateDOMData();
    explanation.innerHTML = "";
  }
  ref.authWithPassword({
    email: email,
    password: password
  }, function(error, authData) {
    if (error) {
     $(".error-message").html("Felaktiga uppgifter");

      console.log("Login Failed!", error);
    } else {
     document.getElementsByClassName('settings-container')[0].classList.toggle("open");

      // console.log("Authenticated successfully with payload:", authData);
      for (var i = 0; i < userName.length; i++) {
        userName[i].innerHTML = "Inloggad som " + authData.password.email
      }
      showThis('user-settings-container');
      hideThis('sign-in-container');
      // console.log("Nu är vi inloggad!");

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
               // window.settings = {
               //   numberofCalenderActivities: parseInt(readableDB.dashboardUsers[key].numberofCalenderActivities),
               //   twitterAccount: readableDB.dashboardUsers[key].twitterAccount,
               //   numberofTweets: readableDB.dashboardUsers[key].numberofTweets,
               //   numberofWeatherRapports: readableDB.dashboardUsers[key].numberofWeatherRapports,
               //   intervalOfWeatherRapports: readableDB.dashboardUsers[key].intervalOfWeatherRapports,
               //   showDeparturesNow: readableDB.dashboardUsers[key].showDeparturesNow
               // }
               // updateDOMData();

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
    console.log("Någon är inloggad");
    showThis('user-settings-container');
    showThis('header-out-container');
    showThis('toggle-settings');
    hideThis('sign-in-container');
    hideThis('header-in-container');
    ref.child("dashboardUsers").child(ref.getAuth().uid).once("value", function(snapshot){
    settings = snapshot.val();
    if(setter != 0)
    {
     updateDOMData("authDataCallback(authData)");
    }
    setter++;
    });
  } else { // EJ INLOGGAD
    showThis('header-in-container');
    showThis('sign-in-container');
    hideThis('header-out-container');
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
  updateDOMData("logOut()");
}

/*###########################################
 ############################################
	HANTERA FORMULÄRDATA
 ############################################
 ############################################*/



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

           window.settings = {
             numberofCalenderActivities: parseInt(readableDB.dashboardUsers[key].numberofCalenderActivities),
             twitterAccount: readableDB.dashboardUsers[key].twitterAccount,
             numberofTweets: readableDB.dashboardUsers[key].numberofTweets,
             numberofWeatherRapports:readableDB.dashboardUsers[key].numberofWeatherRapports,
             intervalOfWeatherRapports: readableDB.dashboardUsers[key].intervalOfWeatherRapports,
             showDeparturesNow: readableDB.dashboardUsers[key].showDeparturesNow
            }
            // console.log(settings);
            // console.log("updateDOMData(); kallad från On value");
            updateDOMData(" database.on(value, function(snapshot) {");
          	return false; // Sluta loopa
 									}
       }
      }
      else {
       // console.log("Ingen inloggad!");
       updateDOMData("else database.on(value, function(snapshot) {);")
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

var ref = new Firebase("https://vilhelmdashboard.firebaseio.com");
/*###########################################
 ############################################
 Skicka in inställningar
 ############################################
 ############################################*/
var setings = {
					numberofCalenderActivities: 3,
					twitterAccount: "dagensnyheter",
					numberofTweets: 5,
					numberofWeatherRapports: 5,
					intervalOfWeatherRapports: 6,
					showDeparturesNow: false
};
	var user = ref.getAuth();
	// console.log(user);
	var userName = document.getElementsByClassName('user-name');


	if(user != null) {

		for (var i = 0; i < userName.length; i++) {
			userName[i].innerHTML = user.password.email
		}
	}
/*##########################################
############################################
	              Skapa användare.
############################################
############################################*/

var explanation = document.getElementsByClassName('explaination')[0];


function createNewUser(email,password) {
	ref.createUser({
		email    : email,
		password : password
	},
	function(error, userData)
	{
		if (error) {
					// console.log("Error creating user:", error);
		}
		else {
					// console.log("Successfully created user account with uid:", userData.uid);
					ref.child("dashboardUsers").child(userData.uid).set(setings);
					logInUser(email,password,true);
			}
});
}

var registerBtn = document.getElementById("register-btn");
	registerBtn.addEventListener("click",function() {
	createNewUser(
		document.getElementsByClassName('user-email-adress')[0].value,
	document.getElementsByClassName('user-password')[0].value
	)
})
// createNewUser("ville@mail.se","abc123");
// createNewUser("test@mail.se","abc");
// createNewUser("hej@mail.se","abc");
// createNewUser("tjena@mail.se","abc");
// createNewUser("abc@mail.se","abc");
/*###########################################
	############################################
													Logga in användare
############################################
############################################*/
// var userName = document.getElementById('user-name');
var signinContainer = document.getElementsByClassName('sign-in-container');
var signinBtn = document.getElementById('sign-in-btn');

signinBtn.addEventListener("click", function() {
var signinName = document.getElementsByClassName('user-email-adress')[0].value;
var signinPassword = document.getElementsByClassName('user-password')[0].value;
logInUser(signinName,signinPassword,false);
});
function logInUser(email,password,newUser) {
		if(newUser) {
			explanation.innerHTML = "Tack för att du registerat dig! Vi har fyllt i lite förslag på hur appen ska sättas upp. Välkommen att ändra efter eget huvud!";
		}
		else {
			explanation.innerHTML = "";
		}
	ref.authWithPassword({
	   email    : email,
		  password : password
		}, function(error, authData) {
		  if (error) {
		    // console.log("Login Failed!", error);
		  } else {
	    // console.log("Authenticated successfully with payload:", authData);
					// userName.innerHTML = authData.password.email;

					for (var i = 0; i < userName.length; i++) {
						userName[i].innerHTML = authData.password.email
					}

					document.getElementsByClassName('sign-in-container')[0].style.display = "none";
					document.getElementsByClassName('user-settings-container')[0].style.display = "block";
					showData(); // VISA ANVÄNDARENS DATA
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
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
				document.getElementsByClassName('sign-in-container')[0].style.display = "none";
				document.getElementsByClassName('sign-out-container')[0].style.display = "block";
				document.getElementsByClassName('user-settings-container')[0].style.display = "block";
				showData();
  } else { // EJ INLOGGAD

			document.getElementsByClassName('sign-out-container')[0].style.display = "none";
			document.getElementsByClassName('sign-in-container')[0].style.display = "block";
   // console.log("User is logged out");
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
	logOutBtn[i].addEventListener("click",logOut);
}

// document.getElementById('log-out-btn').addEventListener("click",logOut);
function logOut() {
document.getElementsByClassName('sign-out-container')[0].style.display = "none";
document.getElementsByClassName('sign-in-container')[0].style.display = "block";
document.getElementsByClassName('user-settings-container')[0].style.display = "none";
ref.unauth();
clearData();
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

showCloseDepartures.addEventListener("click",function() {
this.checked == true ? showCloseText.innerHTML = "Ja" : showCloseText.innerHTML = "Nej";
});



var submitBtn = document.getElementById('submit-btn');
submitBtn.addEventListener("click",updateInfo);

function updateInfo () {
	 ref.child('dashboardUsers').child(ref.getAuth().uid).update(
			{
					numberofCalenderActivities: googleAmount.value,
					twitterAccount: twitterFollow.value,
					numberofTweets: twitterAmount.value,
					numberofWeatherRapports: weatherAmount.value,
					intervalOfWeatherRapports: weatherInterval.value,
					showDeparturesNow: showCloseDepartures.checked
				}
		);
}
		function showData() { // VISA ANVÄNDARENS SATTA DATA I INPUTFÄLTEN
			// console.log("showdata kallad på");
			var database = ref;
			user = ref.getAuth();
			database.on("value", function(snapshot) {
							var readableDB = snapshot.val(); // readableDB är alltså en läsbar snapshot på vår databas.
 						for(var key in readableDB.dashboardUsers) {
									if(key == user.uid)
									{
											googleAmount.value = readableDB.dashboardUsers[key].numberofCalenderActivities;
											twitterFollow.value = readableDB.dashboardUsers[key].twitterAccount;
											twitterAmount.value = readableDB.dashboardUsers[key].numberofTweets;
											weatherAmount.value = readableDB.dashboardUsers[key].numberofWeatherRapports;
											weatherInterval.value = readableDB.dashboardUsers[key].intervalOfWeatherRapports;
											showCloseDepartures.checked = readableDB.dashboardUsers[key].showDeparturesNow;
											showCloseDepartures.checked == true ? showCloseText.innerHTML = "Ja" : showCloseText.innerHTML = "Nej";
									}
							}
							// console.log("Authenticated user with uid:", user.uid);
					},
					function(errorObject) {
							// console.log("The read failed: " + errorObject.code);
					});
		}

		function clearData() { // Exempelvis när någon loggar ut
			googleAmount.value = "";
			twitterFollow.value = "";
			twitterAmount.value = "";
			weatherAmount.value = "";
			weatherInterval.value = "";
			showCloseDepartures.checked = false;
			showCloseText.innerHTML = "Nej";
		}
// showData()

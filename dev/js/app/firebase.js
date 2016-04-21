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
					intervalOfWeatherRapports: 5,
					showDeparturesNow: false
};


	// ref.child("users").child(userData.uid).push(userSettings);

	/*###########################################
	 ############################################
	              Skapa användare.
	############################################
	############################################*/

function createNewUser(email,password) {
	ref.createUser({
		email    : email,
		password : password
	},
	function(error, userData)
	{
		if (error) {
					console.log("Error creating user:", error);
		}
		else {
					console.log("Successfully created user account with uid:", userData.uid);
					ref.child("dashboardUsers").child(userData.uid).set(setings);
			}
});
}

// createNewUser("ville@mail.se","abc123");

/*###########################################
	############################################
													Logga in användare
############################################
############################################*/


function logInUser(email,password) {

	ref.authWithPassword({
	   email    : email,
		  password : password
		}, function(error, authData) {
		  if (error) {
		    console.log("Login Failed!", error);
		  } else {
	    console.log("Authenticated successfully with payload:", authData);
					userName.innerHTML = authData.password.email;
	  }
	});
}
// logInUser("ville@mail.se","abc123");

/*###########################################
 ############################################
 Kolla om någon är inloggad
 ############################################
 ############################################*/

function authDataCallback(authData) {
  if (authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
  } else {
    console.log("User is logged out");
  }
}
// ref.onAuth(authDataCallback);

/*###########################################
 ############################################
 Logga ut användare
 ############################################
 ############################################*/

	// ref.unauth();




/*###########################################
 ############################################
	HANTERA FORMULÄRDATA
 ############################################
 ############################################*/
	var user = ref.getAuth();
	// var query = ref.child('dashboardUsers').child(ref.getAuth().uid);
	var query = ref.child('dashboardUsers').child(ref.getAuth().uid).update(
			{
					numberofCalenderActivities: 7,
					twitterAccount: "kallepong",
					numberofTweets: 10,
					numberofWeatherRapports: 5,
					intervalOfWeatherRapports: 5,
					showDeparturesNow: true
				}
		);


	var userName = document.getElementById('user-name');
	var googleAmount = document.getElementById('google-cal-amount');
	var twitterFollow = document.getElementById('twitter-follow');
	var twitterAmount = document.getElementById('twitter-posts-amount');
	var weatherAmount = document.getElementById('weather-rapport-amount');
	var weatherInterval = document.getElementById('weather-rapport-interval');
	var showCloseDepartures = document.getElementById('show-close-departures-now');

	userName.innerHTML = user.password.email;

	// var database = ref;
	// database.on("value", function(snapshot) {
	// 				var readableDB = snapshot.val(); // readableDB är alltså en läsbar snapshot på vår databas.
	// 				// console.log(readableDB);
	//
	// 				for(var key in readableDB.dashboardUsers) {
	// 					if (key == user.uid) {
	// 							// readableDB.dashboardUsers[key].child("intervalOfWeatherRapports").set(10);
	// 					}
	// 				}
	//
	// 				console.log("Authenticated user with uid:", user.uid);
	// 		},
	// 		function(errorObject) {
	// 				console.log("The read failed: " + errorObject.code);
	// 		});













// ref.child('dashboardUsers').child(chatRef.getAuth().uid).addYourQueryHere()

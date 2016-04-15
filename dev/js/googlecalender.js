var CLIENT_ID = '765342006289-i5i1df5rcv6sg6vh4ejm30f9lm1tjrhc.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  gapi.auth.authorize({
    'client_id': CLIENT_ID,
    'scope': SCOPES.join(' '),
    'immediate': true
  }, handleAuthResult);
}
/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    loadCalendarApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}
/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize({
      client_id: CLIENT_ID,
      scope: SCOPES,
      immediate: false
    },
    handleAuthResult);
  return false;
}
/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi() {
  gapi.client.load('calendar', 'v3', listUpcomingEvents);
}
/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  var request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 15,
    'orderBy': 'startTime'
  });

  request.execute(function(resp) {
    var events = resp.items;

    // console.log(events.length);

    appendPre('Kommande saker i din kalender:');

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];

        var when = event.start.dateTime;
        // when = "<span>"+when+"</span>";
        // whenSpan.innerText = event.start.dateTime;

        if (!when) {
          when = event.start.date;
          // when = "<span>"+when+"</span>";

        }
        appendPre(event.summary, when, events.length);
      }
    } else {
      appendPre('No upcoming events found.');
    }

  });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */

var counter = 0;

function appendPre(event, when, numberofActivities) {
  var calender = document.getElementsByClassName('calender')[0];

  var activity = document.createElement("li");
  activity.className = "calender-activity";
  activity.innerText = event;

  var whenSpan = document.createElement("span");

  whenSpan.className = "activity-date format-date";
  whenSpan.innerText = when;

  if (counter > 0) // Rubriken "Min kalender" ska inte ha ett datum.
  {
    activity.appendChild(whenSpan);
  }
  calender.appendChild(activity);
  if (counter == numberofActivities) {
    formatDate();
  }
  counter++;
}


/*###########################################
 ############################################
                  Format-date
 ############################################
 ############################################*/

 // var str = "Hello world!";
 // var res = str.substr(1, 4);
 // ello

var day;
var month;
var year;
var time;
var dateString;
var weekDay;

var weekDays = ["söndag","måndag","tisdag","onsdag","torsdag","fredag","lördag"];
var months = ["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"];

// 2016-04-18

function formatDate() {
  var formatDate = document.getElementsByClassName("format-date");

  for (var l = 0; l < formatDate.length; l++) {

   dateString = formatDate[l].innerText.substr(0,10);

   console.log(dateString);

   formatDate[l].innerText = formatDate[l].innerText.replace("-","");
   formatDate[l].innerText = formatDate[l].innerText.replace("-","");
   formatDate[l].innerText = formatDate[l].innerText.replace("T","");

   day = formatDate[l].innerText.substr(6,2);
   month = formatDate[l].innerText.substr(4,2);
   year = formatDate[l].innerText.substr(0,4);
   time = formatDate[l].innerText.substr(8,5);

   weekDay = weekDays[new Date(dateString).getDay()];

   if(time.length > 0) {
    formatDate[l].innerText = weekDay+" "+day+" "+months[month-1]+" "+year+" Kl: "+time;
   }
   else {
    formatDate[l].innerText =  weekDay+" "+day+" "+months[month-1]+" "+year;
   }
  }
}


// var dateString = "2016-04-12";
//
// var daysOfWeek = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
// var whichDay = daysOfWeek[new Date(dateString).getDay()];

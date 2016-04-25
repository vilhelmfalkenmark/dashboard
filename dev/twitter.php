<?php
session_start();
require_once("twitteroauth/twitteroauth/twitteroauth.php"); //Path to twitteroauth library

if(isset($_GET['twitterAccount'])) {
  $twitteruser = $_GET['twitterAccount'];
} else {
  $twitteruser = "dagensnyheter";
}
if(isset($_GET['numberofTweets'])) {
  $notweets = $_GET['numberofTweets'];
} else {
  $notweets = 5;
}
$consumerkey = "dJUUVznOTJYgdwS3rY2RzPdEt";
$consumersecret = "v9Q31hgBarcvoPjGu7IHwyxRMXNxb0xtts93HltEuX7kfSCvuk";
$accesstoken = "721044744206475264-kW7Pb2SeniCxuVZDfzD3yR3IORQDWzj";
$accesstokensecret = "XfJjisUr97en5K7WMNIquF7OlfSsOKgpAKvoXAQJzt5HR";

function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}

$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);

$tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".$twitteruser."&count=".$notweets);

echo json_encode($tweets);
?>

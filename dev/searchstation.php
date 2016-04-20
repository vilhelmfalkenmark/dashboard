<?php
// header('Content-Type: application/json');
// SL Platsuppslag
// API-nyckel
// e1a91d0e65ab4ffbbc3fbd7425677d8c
// ###############
// SL Realtidsinformation 3
// API-nyckel
// d4cc94dd04474a2cb459f141003e416a

$apikey_places = "e1a91d0e65ab4ffbbc3fbd7425677d8c";
$apikey_realTime = "d4cc94dd04474a2cb459f141003e416a";

if(isset($_GET['stationname'])) {
  $station_name = $_GET['stationname'];
} else {
  $station_name = "orminge centrum";
}
$station_name = str_replace(" ","%20",$station_name);

$query = "http://api.sl.se/api2/typeahead.json";
$query .= "?key=".$apikey_places;
$query .= "&searchstring=".$station_name."&stationsonly=true";

$json = file_get_contents($query);
$allStations = json_decode($json,true);

// var_dump($json);
// var_dump($allStations);
// var_dump($allStations["ResponseData"])

// echo $allStations["ResponseData"][0]["SiteId"]; // Den första träffen, dvs. den som faktiskt motsvarar det man skrivit in.

$station_id = $allStations["ResponseData"][0]["SiteId"]; // Den första träffen, dvs. den som faktiskt motsvarar det man skrivit in.

$station_query = "http://api.sl.se/api2/realtimedepartures.json";
$station_query .= "?key=".$apikey_realTime."&siteid=".$station_id."&timewindow=15";

// $response_json = file_get_contents($station_query);
//
// echo $response_json;

$response_json = file_get_contents($station_query);
$response_json = json_decode($response_json);
echo json_encode($response_json);


// foreach($allStations["ResponseData"] as $item) {
//
//   echo "<p>".$item["SiteId"]."</p>";
//
//
//   // $stop_id = substr($item["id"],4);
//   // $distance = $item["dist"];
//   // array_push($stop_ids,$stop_id);
//   // array_push($distances,$distance);
// }
// $json = json_decode($json);




// echo json_encode($json);
?>

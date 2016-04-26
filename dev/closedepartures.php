<?php
// SL Platsuppslag
// API-nyckel
// e1a91d0e65ab4ffbbc3fbd7425677d8c

// ###############
// SL Realtidsinformation 3
// API-nyckel
// d4cc94dd04474a2cb459f141003e416a

// ###############
// SL Närliggande hållplatser
// API-nyckel
// 89ba22155d944429b9b90feb2f3d3645

$lat = "";
$long = "";

if(isset($_GET['lat'])) {
  $lat = $_GET['lat'];
} else {
  $lat = "58";
}

if(isset($_GET['long'])) {
  $long = $_GET['long'];
} else {
  $long = "18";
}

$apikey_closeStops = "89ba22155d944429b9b90feb2f3d3645";
$apikey_realTime = "d4cc94dd04474a2cb459f141003e416a";

$stop_ids = array();
$distances =  array();

$query = "http://api.sl.se/api2/nearbystops.json";
$query .="?key=".$apikey_closeStops;
$query .="&originCoordLat=".$lat."&originCoordLong=".$long;

$json = file_get_contents($query);
$allStations = json_decode($json,true);

// var_dump($json);
// var_dump($allStations);

foreach($allStations["LocationList"]["StopLocation"] as $item) {
  $stop_id = substr($item["id"],4);
  $distance = $item["dist"];
  array_push($stop_ids,$stop_id);
  array_push($distances,$distance);
}

$response_json = array();

$distance_counter = 0;

foreach ($stop_ids as $id) {
  $query_2 = "http://api.sl.se/api2/realtimedepartures.json";
  $query_2 .= "?key=".$apikey_realTime."&siteid=".$id."&timewindow=15";
  $response = file_get_contents($query_2);
  // $response->distance = $distances($distance_counter);

  $obj2 = json_decode($response);
  $obj2->distance = $distances[$distance_counter];
  $response_json[] = $obj2;
  $distance_counter++;

}
echo json_encode($response_json);
?>

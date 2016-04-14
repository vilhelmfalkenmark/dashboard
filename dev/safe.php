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

$query = "http://api.sl.se/api2/nearbystops.json";
$query .="?key=".$apikey_closeStops;
$query .="&originCoordLat=".$lat."&originCoordLong=".$long;

$json = file_get_contents($query);
$obj = json_decode($json);
$array = json_decode($json,true);

foreach($array["LocationList"]["StopLocation"] as $item) {
  $stop_id = substr($item["id"],4);
  array_push($stop_ids,$stop_id);
}

$response_json = array("");
$response_list = array();

foreach ($stop_ids as $id) {
  // echo $id;
  $query_2 = "http://api.sl.se/api2/realtimedepartures.json";
  $query_2 .= "?key=".$apikey_realTime."&siteid=".$id."&timewindow=5";
  $response = file_get_contents($query_2);

  $obj2 = json_decode($response);
  $response_list[] = $obj2;

}

echo json_encode($response_list);

?>

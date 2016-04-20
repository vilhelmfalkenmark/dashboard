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
$json = json_decode($json);
echo json_encode($json);
?>

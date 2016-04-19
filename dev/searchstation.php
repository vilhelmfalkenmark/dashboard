<?php
// SL Platsuppslag
// API-nyckel
// e1a91d0e65ab4ffbbc3fbd7425677d8c
// ###############
// SL Realtidsinformation 3
// API-nyckel
// d4cc94dd04474a2cb459f141003e416a

// $station_name = "";
$apikey_places = "e1a91d0e65ab4ffbbc3fbd7425677d8c";

// $station_name = "Storängen";
if(isset($_GET['stationname'])) {
  $station_name = $_GET['stationname'];
} else {
  $station_name = "Östanå";
}


$query = "http://api.sl.se/api2/typeahead.json";
$query .= "?key=".$apikey_places;
$query .= "&searchstring=".$station_name."&stationsonly=true";

// $query = "http://api.sl.se/api2/typeahead.json?key=e1a91d0e65ab4ffbbc3fbd7425677d8c&searchstring=Danderyd&stationsonly=true";

$json = file_get_contents($query);
$allStations = json_encode($json);
var_dump($json);
// var_dump($allStations);

?>

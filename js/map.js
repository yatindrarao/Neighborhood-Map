var map;
var markers = [];
var bounds;

function initMap(){
  var india = {lat: 20.5937, lng: 78.9629};
  map = new google.maps.Map(document.getElementById('map'), {
      center: india,
      zoom: 5
    });
  // initBound();
}
function initBound(){
  bounds = new google.maps.LatLngBounds();
}
// Sets the map on all markers
function setMapOnAll(map){
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}
//  Removes Markers from the map, but keeps them in array
function clearMarkers(){
  setMapOnAll(null);
}
function deleteMarkers() {
  clearMarkers();
  markers = [];
}
function setZoom(){
  map.fitBounds(bounds);       // auto-zoom
  map.panToBounds(bounds);     // auto-center
}

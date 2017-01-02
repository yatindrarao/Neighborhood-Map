var map;
var markers = [];
function initMap(){
  var india = {lat: 20.5937, lng: 78.9629};
  map = new google.maps.Map(document.getElementById('map'), {
      center: india,
      zoom: 5
    });
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

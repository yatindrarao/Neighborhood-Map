var map;
var markers = [];
var bounds;
var locationNames = [];
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
function getLatLong(locations){
  var places = [];
  var locationWithLtLg;
  var url = "https://maps.googleapis.com/maps/api/geocode/json?address=";
  var placeUrl;
  var key = "AIzaSyCQyOoOoyLCLeU7A4gmzfZqzEhVY70mKUQ";
  for (var i = 0; i < locations.length; i++) {
    placeUrl = url + locations[i] + "&key=" + key;
    $.ajax(placeUrl, {
      success: function(response){
        if (response.status == "OK") {
          locationWithLtLg = response.results[0].geometry.location;
          places.push(locationWithLtLg);
        }
      },
      error: function(error){
        alert("something went wrong");
      },
      async: false
    });
  }
  return places;
}
function defaultMarkers(locations){
  initBound();
  var preMarkers = [];
  var loc;
  // console.log(bounds);
  for (var i = 0; i < locations.length; i++) {
    preMarkers.push(createMarker(locations[i].latlng));
    bounds.extend(locations[i].latlng);
  }
  markers = preMarkers;
  // console.log(bounds);
}
function updateMap(searchLocation) {
  var request = {
    query: searchLocation
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, handleLocations);
}

function handleLocations(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    var place;
    var locationMarkers = [];
    initBound();
    for (var i = 0; i < results.length; i++) {
      place = {lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng()};
      locationMarkers.push(createMarker(place));
      bounds.extend(place);
      vm.relatedLocations.push(results[i].name);
    }
    // console.log(markers);
    setMapOnAll(null);
    markers = locationMarkers;

    // console.log(markers);
    setZoom()
  }
  // console.log(locationNames);
}

function createMarker(location){
  return new google.maps.Marker({
    position: location,
    map: map
  })
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

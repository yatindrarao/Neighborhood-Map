var map, markers = [], bounds, locationNames = [];

function initMap(){
  var india = {lat: 20.5937, lng: 78.9629};
  map = new google.maps.Map(document.getElementById('map'), {
      center: india,
      zoom: 4
    });
}

function initBound(){
  bounds = new google.maps.LatLngBounds();
}

function defaultMarkers(locations){
  var preMarkers = [];
  var loc;

  initBound();

  for (var i = 0; i < locations.length; i++) {
    preMarkers.push(createMarker(locations[i].latlng, locations[i].name));
    bounds.extend(locations[i].latlng);
  }
  markers = preMarkers;
  map.setCenter(bounds.getCenter());
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
      locationMarkers.push(createMarker(place, results[i].name));
      bounds.extend(place);
      vm.relatedLocations.push(results[i].name);
    }
    setMapOnAll(null);
    markers = locationMarkers;
    setZoom()
  }
}

function createMarker(location, content){
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  var infowindow = new google.maps.InfoWindow();
  google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){
        return function() {
          openMapInfoWindow(marker,content,infowindow);
        };
    })(marker,content,infowindow));
  return marker;
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

function openMapInfoWindow(marker, content, infowindow){
  infowindow.setContent(content);
  infowindow.open(map,marker);
}

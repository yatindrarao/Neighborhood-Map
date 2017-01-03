var map, markers = [], bounds, locationNames = [], infowindow,
    infowindowSettings = {maxWidth: 200};

// Callback to intialize Google Map
function initMap(){
  var india = {lat: 20.5937, lng: 78.9629};
  map = new google.maps.Map(document.getElementById('map'), {
      center: india,
      zoom: 4
    });
  infowindow = new google.maps.InfoWindow(infowindowSettings);  
};

// Initializing bound object for auto zoom in, zoom out
function initBound(){
  bounds = new google.maps.LatLngBounds();
};

// Initialize default markers on map
function defaultMarkers(locations){
  var preMarkers = [], loc;

  initBound();

  for (var i = 0; i < locations.length; i++) {
    preMarkers.push(createMarker(locations[i].latlng, locations[i].name));
    bounds.extend(locations[i].latlng);
  }
  markers = preMarkers;
  map.setCenter(bounds.getCenter());
};

// Update markers on map with latest locations
function updateMap(searchLocation) {
  var request = {
    query: searchLocation
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, handleLocations);
};

function handleLocations(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    var place, locationMarkers = [];

    // Set bound object for auto zoom in zoom out
    initBound();
    for (var i = 0; i < results.length; i++) {
      place = {lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng()};
      locationMarkers.push(createMarker(place, results[i].name));
      bounds.extend(place);
      // Updates list of related locations
      vm.relatedLocations.push(results[i].name);
    }
    // Hide all markers for new markers
    setMapOnAll(null);
    // Display new markers
    markers = locationMarkers;
    // Set zoom according to group of markers
    setZoom()
  }
  else{
      alert("Some error has occurred while fetching places from google");
  }
};

function createMarker(location, content){
  var marker = new google.maps.Marker({
    position: location,
    map: map,
  });

  // Click handler for both marker on map and location in DOM
  marker.addListener('click', function(){
      openMapInfoWindow(marker,content);
    });
  return marker;
};

// Sets the map on all markers
function setMapOnAll(map){
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
};

//  Removes Markers from the map, but keeps them in array
function clearMarkers(){
  setMapOnAll(null);
};

function deleteMarkers() {
  clearMarkers();
  markers = [];
};

function setZoom(){
  map.fitBounds(bounds);       // auto-zoom
  map.panToBounds(bounds);     // auto-center
};

// Calls MediaWiki Api for city information from Wikipedia
function openMapInfoWindow(marker, content){
  var contentInfo;
  var  wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&format=json&search="
                + content;

  // Sets marker animation for click event
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function(){
    marker.setAnimation(null)
  },1000);

  // Api call
  // If fails show alert with message and display only city name in marker
  var wikiRequestTimeout = setTimeout(function(){
    alert("failed to load the wikipedia resource");
    infowindow.setContent(content);
    infowindow.open(map, marker);
  }, 6000);

  // Return wikipedia content with HTML structure
  $.ajax({
    url: wikiURL,
    dataType: "jsonp",
    success: function(response){
      var title, details, link, htmlContent;
      title = response[1][0];
      details = response[2][0];
      link = response[3][0];
      htmlContent = '<div>'+
            '<h3>'+ title +'</h3>'+
            '</br>'+
            '<p>' + details + '</p>'+
            '<a href="'+ link + '">'+ link + '</a>'+
            '</br>'+
            '<p>Source: Wikipedia</p>'+
            '</br>'+
            '</div>';
      // Clear timeout on successful call
      clearTimeout(wikiRequestTimeout);
      infowindow.setContent(htmlContent);
      infowindow.open(map,marker);
    }
  });
};

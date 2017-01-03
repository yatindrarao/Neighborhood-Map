var map, markers = [], bounds, locationNames = [], infowindow,
    infowindowSettings = {maxWidth: 200};


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
  var dfd1 = $.Deferred();
  var request = {
    query: searchLocation
  };
  service = new google.maps.places.PlacesService(map);
  var dfd = $.Deferred();
  dfd.done(function(result){
    return result;
  });
  // service.textSearch(request, handleLocations);
  service.textSearch(request, function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var place;

      // Set bound object for auto zoom in zoom out
      vm.relatedLocations = [];

      for (var i = 0; i < results.length; i++) {
        place = {lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng()};
        // Updates list of related locations
        vm.relatedLocations.push({name: results[i].name, latlng: place});
      }
      // console.log(vm.relatedLocations);
      setMarkers(vm.relatedLocations);
      dfd.resolve(vm.relatedLocations);
    }
    else{
        alert("Some error has occurred while fetching places from google");
        dfd.resolve([]);
    }
  });
  return dfd.promise();
};

// function handleLocations(results, status) {
//   if (status == google.maps.places.PlacesServiceStatus.OK) {
//     var place;
//
//     // Set bound object for auto zoom in zoom out
//     vm.relatedLocations = [];
//
//     for (var i = 0; i < results.length; i++) {
//       place = {lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng()};
//       // Updates list of related locations
//       vm.relatedLocations.push({name: results[i].name, latlng: place});
//     }
//     // console.log(vm.relatedLocations);
//     setMarkers(vm.relatedLocations);
//     return vm.relatedLocations;
//   }
//   else{
//       alert("Some error has occurred while fetching places from google");
//       return [];
//   }
// };

function setMarkers(locations){
   var place, locationMarkers = [];
   initBound();
   for (var i = 0; i < locations.length; i++) {
     place = locations[i];
     locationMarkers.push(createMarker(place.latlng, place.name));
     bounds.extend(place.latlng);
   }
   // Hide all markers for new markers
   setMapOnAll(null);
   // Display new markers
   markers = locationMarkers;
   // Set zoom according to group of markers
   setZoom();
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
  // Return wikipedia content with HTML structure
  $.ajax({
    url: wikiURL,
    dataType: "jsonp"
  })
  .done(function(response){
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
    infowindow.setContent(htmlContent);
    infowindow.open(map,marker);
  })
  .fail(function(error){
    alert("failed to load the wikipedia resource");
    infowindow.setContent(content);
    infowindow.open(map, marker);
  });
};

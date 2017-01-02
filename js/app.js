var service;

function defaultMarkers(locations){
  initBound();
  var preMarkers = [];
  var loc;
  // console.log(bounds);
  for (var i = 0; i < locations.length; i++) {
    preMarkers.push(createMarker(locations[i]));
    bounds.extend(locations[i]);
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
function createMarker(location){
  return new google.maps.Marker({
    position: location,
    map: map
  })
}

function handleLocations(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    var place;
    var locationMarkers = [];
    console.log(results.length);
    initBound();
    for (var i = 0; i < results.length; i++) {
      place = {lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng()};
      locationMarkers.push(createMarker(place));
      bounds.extend(place);
    }
    // console.log(markers);
    setMapOnAll(null);
    markers = locationMarkers;
    // console.log(markers);
    setZoom()
  }
}
function getLocations(locations){
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
function ViewModel(){
  var self = this;
  self.locations = getLocations(["Jaipur", "Bangalore", "Ahmedabad", "Pune", "Hyderabad"]);
  self.searchLocation = ko.observable();
  self.searchLocation.extend({ rateLimit: 1000 });
  defaultMarkers(self.locations);

  self.searchLocation.subscribe(function(newVal){
    // deleteMarkers();
    if(newVal.length > 0){
      updateMap(newVal);
    }
  })
};


ko.applyBindings(new ViewModel());

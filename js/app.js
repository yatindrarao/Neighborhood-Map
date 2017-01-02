var service;

function defaultMarkers(locations){
  markers = locations.map(function(location, i) {
          return new google.maps.Marker({
            position: location,
            map: map
          });
        });
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
function ViewModel(){
  var self = this;
  self.locations = [
    {lat: 20.388794, lng: 78.120407},
    {lat: 21.761524, lng:	70.627625},
    {lat: 28.078636, lng: 80.471588},
    {lat: 23.302189, lng: 81.356804},
    {lat: 25.563322, lng: 84.869804}
  ];
  self.searchLocation = ko.observable();
  self.searchLocation.extend({ rateLimit: 1000 });
  defaultMarkers(self.locations);

  self.searchLocation.subscribe(function(newVal){
    // deleteMarkers();
    initBound();
    if(newVal.length > 0){
      updateMap(newVal);
    }
  })
};


ko.applyBindings(new ViewModel());

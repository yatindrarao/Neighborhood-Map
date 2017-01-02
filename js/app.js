var map;
var service;
var infowindow;

function initialize(searchLocation) {
  var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);

  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });

  var request = {
    query: searchLocation
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      // createMarker(results[i]);
      console.log(results[i]);
    }
  }
}
function ViewModel(){
  var self = this;
  this.searchLocation = ko.observable("testing");
  this.searchLocation.extend({ rateLimit: 1000 })
  this.searchLocation.subscribe(function(newVal){
    initialize(newVal);
  })
};


ko.applyBindings(new ViewModel());

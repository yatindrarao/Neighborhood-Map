var defaultLocations = [
    {name: "Jaipur", latlng: {lat: 26.9124336, lng: 75.7872709}},
    {name: "Bangalore", latlng: {lat: 12.9715987, lng: 77.5945627}},
    {name: "Ahmedabad", latlng: {lat: 23.022505, lng: 72.5713621}},
    {name: "Mumbai", latlng: {lat: 18.5204303, lng: 73.8567437}},
    {name: "Hyderabad", latlng: {lat: 17.385044, lng: 78.486671}}
  ];

// check if string contains other string
function stringHas(string, contains){
  if(contains.length > string.length)
    return false;
  else
    return string.indexOf(contains) > -1;
};

var viewModel = function(){
  var self = this;
  self.searchLocation = ko.observable();
  self.relatedLocations = [];

  //Initialize model with default locations
  self.relatedLocations = defaultLocations;

  self.filteredList = ko.computed(function(){
    var query = self.searchLocation();
    var filtered;
    if (!query && self.filteredList) {
      infowindow.close();
      setMarkers(self.relatedLocations);
      return self.relatedLocations;
    }
    else if(!query){
      return self.relatedLocations;
    }
    else{
      var filtered = [];
      query = query.toLowerCase();
      filtered = ko.utils.arrayFilter(self.relatedLocations, function(location) {
           return stringHas(location.name.toLowerCase(), query);
       });
      if(filtered.length > 0){
        setMarkers(filtered);
        return filtered;
      }
      else{
        clearMarkers();
        return;
      }
    }
  });

  // Click on location in list view open information window on map
  self.openInfoWindow = function(index, data){
    openMapInfoWindow(markers[index], data.name);
  }
};

// Callback to intialize Google Map
function initMap(){
  var india = {lat: 20.5937, lng: 78.9629};
  map = new google.maps.Map(document.getElementById('map'), {
      center: india,
      zoom: 4
    });
  infowindow = new google.maps.InfoWindow(infowindowSettings);
  // Set markers for default locations
  defaultMarkers(defaultLocations);
};

// Error Handled for Google Maps API
function googleError(){
  alert("somer error has occurred while loading google maps api");
};

// For accessing ViewModel in global space
var vm = new viewModel();
ko.applyBindings(vm);

var viewModel = function(){
  var self = this;
  var defaultLocations = [
      {name:"Jaipur", latlng: {lat: 26.9124336, lng: 75.7872709}},
      {name: "Bangalore", latlng: {lat: 12.9715987, lng: 77.5945627}},
      {name: "Ahmedabad", latlng: {lat: 23.022505, lng: 72.5713621}},
      {name: "Mumbai", latlng: {lat: 18.5204303, lng: 73.8567437}},
      {name: "Hyderabad", latlng: {lat: 17.385044, lng: 78.486671}}
    ];
  self.searchLocation = ko.observable();
  self.relatedLocations = ko.observableArray();

  //Initialize model with default locations
  defaultLocations.forEach(function(location){
    self.relatedLocations.push(location.name);
  });

  // Set markers for default locations
  defaultMarkers(defaultLocations);

  // Watch serachLocation model for change in value
  self.searchLocation.subscribe(function(newVal){
    self.relatedLocations.removeAll();
    // If search string length is greater than 0 update map with new markers
    if(newVal.length > 0){
      updateMap(newVal);
    }
    // Delete all markers and initialize the app with default locations
    else{
      deleteMarkers();
      defaultMarkers(defaultLocations);
      defaultLocations.forEach(function(location){
        self.relatedLocations.push(location.name);
      });
    }
  });

  // Click on location in list view open information window on map
  self.openInfoWindow = function(index, data){
    openMapInfoWindow(markers[index], data);
  }
};

// For accessing ViewModel in global space
var vm = new viewModel();
ko.applyBindings(vm);

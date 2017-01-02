var viewModel = function(){
  var self = this;
  var defaultLocations = [
      {name:"Jaipur", latlng: {lat: 26.9124336, lng: 75.7872709}},
      {name: "Bangaore", latlng: {lat: 12.9715987, lng: 77.5945627}},
      {name: "Ahmedabad", latlng: {lat: 23.022505, lng: 72.5713621}},
      {name: "Mumbai", latlng: {lat: 18.5204303, lng: 73.8567437}},
      {name: "Hyderabad", latlng: {lat: 17.385044, lng: 78.486671}}
    ];
  self.searchLocation = ko.observable();
  self.relatedLocations = ko.observableArray();
  defaultLocations.forEach(function(location){
    self.relatedLocations.push(location.name);
  });
  self.searchLocation.extend({ rateLimit: 1000 }) //To be commented when run on production
  defaultMarkers(defaultLocations);

  self.searchLocation.subscribe(function(newVal){
    vm.relatedLocations.removeAll();
    if(newVal.length > 0){
      updateMap(newVal);
    }
    else{
      deleteMarkers();
    }
  });
};

var vm = new viewModel();
ko.applyBindings(vm);

function ViewModel(){
  var self = this;
  self.locations = getLocations(["Jaipur", "Bangalore", "Ahmedabad", "Pune", "Hyderabad"]);
  self.searchLocation = ko.observable();
  defaultMarkers(self.locations);

  self.searchLocation.subscribe(function(newVal){
    // deleteMarkers();
    if(newVal.length > 0){
      updateMap(newVal);
    }
  })
};

ko.applyBindings(new ViewModel());

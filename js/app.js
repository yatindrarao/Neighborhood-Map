function ViewModel(){
  var self = this;
  self.locations = getLocations(["Jaipur", "Bangalore", "Ahmedabad", "Pune", "Hyderabad"]);
  self.searchLocation = ko.observable();
  self.searchLocation.extend({rateLimit: 1500}) //To be commented when run on production
  defaultMarkers(self.locations);

  self.searchLocation.subscribe(function(newVal){
    // deleteMarkers();
    if(newVal.length > 0){
      updateMap(newVal);
    }
    else{
      deleteMarkers();
    }
  })
};

ko.applyBindings(new ViewModel());

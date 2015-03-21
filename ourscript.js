var placesList;
var count = 0;
	
function determineLocation() {
	// check for Geolocation support
	if (navigator.geolocation) {
	  console.log('Geolocation is supported!');
	}
	else {
	  console.log('Geolocation is not supported for this Browser/OS version yet.');
	}
	
    var startPos;
	var lat;
	var lon;
    var geoOptions = {
  	maximumAge: 5 * 60 * 1000,
  	timeout: 10 * 1000,
    enableHighAccuracy: true
    }

    var geoSuccess = function(position) {
      startPos = position;
	  lat = startPos.coords.latitude;
	  lon = startPos.coords.longitude;
	  console.log('determineLocation() - Success!');
	  getResults(lat,lon);
    };
    var geoError = function(error) {
      console.log('Error occurred. Error code: ' + error.code);
      // error.code can be:
      //   0: unknown error
      //   1: permission denied
      //   2: position unavailable (error response from location provider)
      //   3: timed out
    };
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
}

function getResults(lat,lon) {
	console.log('lat: ' + lat + ', lon: ' + lon);
	var service;
	var map;

	//var distance = document.getElementById('radius');
	//var rad = distance.options[distance.selectedIndex].value;
	var distance = 2500; //in meters
	
	console.log(document.getElementById('openNow').checked);
	
	var currentPosition = new google.maps.LatLng(lat,lon);
	
	map = new google.maps.Map(document.getElementById('map'), {
      center: currentPosition,
      zoom: 15
    });
	
	var request = {
		location: currentPosition,
		radius: distance, //meters to miles conversion: input/0.00062137
		openNow: false,
		types: ['restaurant','meal_delivery','meal_takeaway','bar'] //removed food,cafe
	};
	
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, callback);
}

function callback(results, status, pagination) {
  console.log(status);
  if (status == google.maps.places.PlacesServiceStatus.OK) {
	/*
	if (pagination.hasNextPage) {
      var moreButton = document.getElementById('more');

      moreButton.disabled = false;

      google.maps.event.addDomListenerOnce(moreButton, 'click',
          function() {
        moreButton.disabled = true;
        pagination.nextPage();
      });
	  
    }	
	*/
  	if (pagination.hasNextPage) {
        var moreButton = document.getElementById('right-carousel');
        google.maps.event.addDomListenerOnce(moreButton, 'click',
            function() {
          pagination.nextPage();
		  count++;
        });
	  
     }
	  
	console.log('Returning ' + results.length + ' results');
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      //console.log(place);
	  console.log(i + ': ' + place.name + ': ' + results.length)
	  	  
	  if(i==0 && count==0){
		  var aDiv = document.createElement('div');
		  aDiv.className = 'item active';
		  var bDiv = document.createElement('span');
		  var cPlace = document.createTextNode(place.name);
		  bDiv.appendChild(cPlace);
		  aDiv.appendChild(bDiv);
		  document.getElementById("inner-carousel").appendChild(aDiv);
	  } else {
		  var iDiv = document.createElement('div');
		  iDiv.className = 'item';
		  var kDiv = document.createElement('span');
		  var place = document.createTextNode(place.name);
		  kDiv.appendChild(place);
		  iDiv.appendChild(kDiv);
		  document.getElementById("inner-carousel").appendChild(iDiv);
	  }
    }
	
  }
}

function placeDetails(){
	console.log(arguments.length);
}

function getPlaceDetails(place_id) {
	var request = {
  	  placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4'
	};

	service = new google.maps.places.PlacesService(map);
	service.getDetails(request, placeDetail_callback);
}

function placeDetail_callback(place, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
	  console.log(place);
  }
}

google.maps.event.addDomListener(window, 'load', determineLocation);
var placesList;
var resultPage = 0;
	
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
	  if(error.code == 3){
		  alert('The request timed out. Try again later.');
	  }
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
	service.nearbySearch(request, getResults_callback);
}

function getResults_callback(results, status, pagination) {
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
		  resultPage++;
        });
	  
     }
	  
	console.log('Returning ' + results.length + ' results');
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      console.log(place);
	  console.log(i + ': ' + place.name + ': ' + results.length)
	  	  
	  if(i==0 && resultPage==0){
		  var newLine1 = document.createElement('br');
		  var newLine2 = document.createElement('br');
		  
		  var aDiv = document.createElement('div');
		  aDiv.className = 'item active';
		  //aDiv.id = place.place_id;
		  
		  //var link = document.createElement('a');
		  //link.setAttribute('onclick', 'getPlaceDetails("'+place.place_id+'")');
		  
		  var bDiv = document.createElement('span');
		  var name_text = document.createTextNode(place.name);
		  bDiv.setAttribute('onclick', 'getPlaceDetails("'+place.place_id+'")');
		  bDiv.style.cursor = 'pointer';
		  bDiv.appendChild(name_text);
		  
		  var cDiv = document.createElement('span');
		  var rating_text = document.createTextNode('Rating: ' + place.rating + '/5'
	  		+ ' Rounded: ' + (place.rating * 2).toFixed() / 2 );
		  cDiv.appendChild(rating_text);
		  
		  var dDiv = document.createElement('span');
		  var price_text = document.createTextNode('Price: ' + place.price_level + '/3');
		  dDiv.appendChild(price_text);

		  aDiv.appendChild(bDiv);
		  aDiv.appendChild(newLine1);
		  aDiv.appendChild(cDiv);
		  aDiv.appendChild(newLine2);
		  aDiv.appendChild(dDiv);

		  document.getElementById("inner-carousel").appendChild(aDiv);
	  } else {
		  /*
		  var iDiv = document.createElement('div');
		  iDiv.className = 'item';
		  var kDiv = document.createElement('span');
		  var place = document.createTextNode(place.name);
		  kDiv.appendChild(place);
		  iDiv.appendChild(kDiv);
		  document.getElementById("inner-carousel").appendChild(iDiv);
		  */
		  var newLine1 = document.createElement('br');
		  var newLine2 = document.createElement('br');
		  
		  var aDiv = document.createElement('div');
		  aDiv.className = 'item';
		  //aDiv.id = place.place_id;
		  
		  var bDiv = document.createElement('span');
		  var name_text = document.createTextNode(place.name);
		  bDiv.setAttribute('onclick', 'getPlaceDetails("'+place.place_id+'")');
		  bDiv.style.cursor = 'pointer';
		  bDiv.appendChild(name_text);
		  
		  var cDiv = document.createElement('span');
		  var rating_text = document.createTextNode('Rating: ' + place.rating + '/5'
	  		+ ' Rounded: ' + (place.rating * 2).toFixed() / 2 );
		  cDiv.appendChild(rating_text);
		  
		  var dDiv = document.createElement('span');
		  var price_text = document.createTextNode('Price: ' + place.price_level + '/3');
		  dDiv.appendChild(price_text);

		  aDiv.appendChild(bDiv);
		  aDiv.appendChild(newLine1);
		  aDiv.appendChild(cDiv);
		  aDiv.appendChild(newLine2);
		  aDiv.appendChild(dDiv);

		  document.getElementById("inner-carousel").appendChild(aDiv);
	  } //else
    } //for
  } //if-status-OK
}

function getPlaceDetails(place_id) {
	//console.log('getPlaceDetails() called with ' + place_id);
	var request = {
  	  placeId: place_id
	};

	service = new google.maps.places.PlacesService(map);
	service.getDetails(request, getPlaceDetails_callback);
}

function getPlaceDetails_callback(place, status) {
	//console.log('callaback girlllll');
  if (status == google.maps.places.PlacesServiceStatus.OK) {
	  console.log(place);
  }
}

google.maps.event.addDomListener(window, 'load', determineLocation);
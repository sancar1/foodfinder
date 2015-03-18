var placesList;
	
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
    enableHighAccuracy: false
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
	var distance = 1000;
	
	var current = new google.maps.LatLng(lat,lon);
	
	map = new google.maps.Map(document.getElementById('map'), {
      center: current,
      zoom: 15
    });
	
	var request = {
		location: current,
		radius: distance,
		types: ['food','restaurant','cafe','meal_delivery','meal_takeaway','bar']
	};
	
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, callback);
}

function callback(results, status, pagination) {
  console.log(status);
  var placehtml = '';
  if (status == google.maps.places.PlacesServiceStatus.OK) {
	
	if (pagination.hasNextPage) {
      var moreButton = document.getElementById('more');

      moreButton.disabled = false;

      google.maps.event.addDomListenerOnce(moreButton, 'click',
          function() {
        moreButton.disabled = true;
        pagination.nextPage();
      });
    }	
	
	console.log('Returning ' + results.length + ' results');
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      console.log(place);
	  
	  var iDiv = document.createElement('div');
	  iDiv.className = 'item';
	  var jDiv = document.createElement('div');
	  jDiv.className = 'carousel-content';
	  var kDiv = document.createElement('div');
	  var place = document.createTextNode(place.name);
	  kDiv.appendChild(place);
	  jDiv.appendChild(kDiv);
	  iDiv.appendChild(jDiv);

		//placehtml += '<div class="item"><div class="carousel-content"><div>';
		//placehtml += '<h3>' + place.name + '</h3>';
		//placehtml += '</div></div></div>';
		
		//placehtml += '<br><h3>' + place.name + '</h3></br>';
		document.getElementById("tjcarousel").appendChild(iDiv);
    }
	//document.getElementById("replaceme").innerHTML = placehtml;
	
  }
}

function placeDetails(){
	console.log(arguments.length);
}

function setCarouselHeight(id)
{
	var slideHeight = [];
	$(id+' .item').each(function()
	{
		// add all slide heights to an array
		slideHeight.push($(this).height());
	});

	// find the tallest item
	max = Math.max.apply(null, slideHeight);

	// set the slide's height
	$(id+' .carousel-content').each(function()
	{
		$(this).css('height',max+'px');
	});
}

google.maps.event.addDomListener(window, 'load', determineLocation);
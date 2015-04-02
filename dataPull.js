var placesList;
var resultPage = 0;
var currentPosition;
var paginationPage = [];

var distanceArray = [];
	
function determineLocation() {
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
	
	//console.log('openNow: ' + document.getElementById('openNow').checked);
	
	//var currentPosition = new google.maps.LatLng(lat,lon);
	currentPosition = new google.maps.LatLng(lat,lon);
	map = new google.maps.Map(document.getElementById('map'), {
      center: currentPosition,
      zoom: 15
    });
	var request = {
		location: currentPosition,
		//radius: distance, //meters to miles conversion: input/0.00062137
		openNow: false,
		rankBy: google.maps.places.RankBy.DISTANCE,
		types: ['restaurant','meal_delivery','meal_takeaway','bar'] //removed food,cafe
	};
	
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, getResults_callback);
}

function getResults_callback(results, status, pagination) {
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

	document.getElementById('right-carousel').addEventListener('click', addFavorite);

	//console.log(pagination);
  	if (pagination.hasNextPage) {
        var moreButtonRight = document.getElementById('right-carousel');
        google.maps.event.addDomListenerOnce(moreButtonRight, 'click',
            function() {
          pagination.nextPage();
		  resultPage++;
        });
        var moreButtonLeft = document.getElementById('left-carousel');
        google.maps.event.addDomListenerOnce(moreButtonLeft, 'click',
            function() {
          pagination.nextPage();
		  resultPage++;
        });
    }
	 
	 
  	//console.log(paginationPage.indexOf(pagination.H));
  	//paginationPage.push(pagination.H);
  	//console.log(paginationPage.indexOf(pagination.H));
	if(paginationPage.indexOf(pagination.H) == -1 || paginationPage.indexOf(pagination.H) == 0){  // ?????? why 0
		//console.log('contains pagination.h: ' + _.contains(paginationPage, pagination.H));
		
		paginationPage.push(pagination.H);
		//console.log(pagination.H);
		console.log('Returning ' + results.length + ' results');
		var counter = 0;
		for (var i = 0; i < results.length; i++) {
		  var place = results[i];
		  console.log(place);
		  //console.log(i + ': ' + place.name + ': ' + results.length)
		  
		  
		  /*
		  function addFavorite(){
			  var favorites = document.getElementById('favorites-list');
			  
			  var fave = document.createElement('li');
			  var restaurant = document.getElementById('myCarousel').getElementsByClassName('item active');
			  //console.log(restaurant);
			  var rName = restaurant[0].childNodes[0].innerHTML;
			  console.log(rName);
			  fave.innerHTML = rName;
			  favorites.appendChild(fave);
		  };
		  */
		  
		  //getDistance(place.vicinity);
		
		  if(i==0 && resultPage==0){
			  var aDiv = document.createElement('div');
			  aDiv.className = 'item active';
		  } else {
			  var aDiv = document.createElement('div');
			  aDiv.className = 'item';  
		  } //else
		  
		  var newLine1 = document.createElement('br');
		  var newLine2 = document.createElement('br');
		  
		  var bDiv = document.createElement('span');
		  var name_text = document.createTextNode(place.name);
		  bDiv.id = place.place_id;
		  bDiv.setAttribute('onclick', 'getPlaceDetails("'+place.place_id+'")');
		  bDiv.style.cursor = 'pointer';
		  bDiv.setAttribute('data-target', '#myModal');
		  bDiv.setAttribute('data-toggle', 'modal');
		  bDiv.appendChild(name_text);
		  
		  var cDiv = document.createElement('span');
		  switch((place.rating * 2).toFixed() / 2) {
			  case 0:
				  cDiv.innerHTML = '<i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
				  break;
			  case 0.5:
				  cDiv.innerHTML = '<i class="fa fa-star-half-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
				  break;
			  case 1:
				  cDiv.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
				  break;
			  case 1.5:
				  cDiv.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star-half-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
				  break;
			  case 2:
				  cDiv.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
				  break;
			  case 2.5:
				  cDiv.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
				  break;
			  case 3:
				  cDiv.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
				  break;
			  case 3.5:
				  cDiv.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half-o"></i><i class="fa fa-star-o"></i>';
				  break;
			  case 4:
				  cDiv.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i>';
				  break;
			  case 4.5:
				  cDiv.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half-o"></i>';
				  break;
			  case 5:
				  cDiv.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>';
				  break;
			  default:
				  cDiv.innerHTML = '<i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
				  break;
		  } //switch
		  
		  var dDiv = document.createElement('span');
		  switch(place.price_level) {
			  case 1:
				  dDiv.innerHTML = '<i class="fa fa-usd"></i>';
				  break;
			  case 2:
				  dDiv.innerHTML = '<i class="fa fa-usd"></i><i class="fa fa-usd"></i>';
				  break;
			  case 3:
				  dDiv.innerHTML = '<i class="fa fa-usd"></i><i class="fa fa-usd"></i><i class="fa fa-usd"></i>';
				  break;
			  default:
				  dDiv.innerHTML = '<i class="fa fa-usd icon-invisible"></i>';
				  break;
		  } //switch
		  
		  var photos = place.photos;
		  sDiv = document.createElement('div');
		  if(photos){
			sDiv.innerHTML = '<img src="' + photos[0].getUrl({'maxWidth': 500, 'maxHeight': 500}) + '" id="picture"></img>';
			sDiv.setAttribute('onclick', 'getPlaceDetails("'+place.place_id+'")');
			sDiv.style.cursor = 'pointer';
			sDiv.setAttribute('data-target', '#myModal');
			sDiv.setAttribute('data-toggle', 'modal');
		  }
		  
		  aDiv.appendChild(bDiv); //name
		  aDiv.appendChild(newLine1);
		  aDiv.appendChild(cDiv); //reviews
		  aDiv.appendChild(newLine2);
		  aDiv.appendChild(dDiv); //price
		  
		  /*
		  var qDiv = document.createElement('span');
		  //qDiv.id = place.place_id;
		  qDiv.innerHTML = '<br>' + distanceArray[counter];
		  aDiv.appendChild(qDiv); //distance
		  counter++;
		  */
		  
		  aDiv.appendChild(sDiv); //photo

		  document.getElementById("inner-carousel").appendChild(aDiv);
		  
		  //var infoPrice = document.getElementById('infoPrice');
		  //var infoRatings = document.getElementById('infoRatings');
		  var infoHours = document.getElementById('infoHours');
		  
		} //for
	} //if(paginationPage.indexOf(pagination.H) == -1))
	else{
		//console.log('Results already exist');
		//console.log(pagination.H);
		
		//console.log('contains pagination.h: ' + _.contains(paginationPage, pagination.H));
	}
  } //if-status-OK
}

function addFavorite(){
  var favorites = document.getElementById('favorites-list');
  
  var fave = document.createElement('li');
  var restaurant = document.getElementById('myCarousel').getElementsByClassName('item active');
  //console.log(restaurant);
  var rName = restaurant[0].childNodes[0].innerHTML;
  var rId = restaurant[0].childNodes[0].id;
  console.log(rName + ' ' + rId);
  fave.innerHTML = rName;
  fave.id = rId;
  fave.setAttribute('onclick', 'getPlaceDetails("'+rId+'")');
  fave.style.cursor = 'pointer';
  fave.setAttribute('data-target', '#myModal');
  fave.setAttribute('data-toggle', 'modal');
  favorites.appendChild(fave);
};

function getPlaceDetails(place_id) {
	var request = {
  	  placeId: place_id
	};

	service = new google.maps.places.PlacesService(map);
	service.getDetails(request, getPlaceDetails_callback);
}

function getPlaceDetails_callback(place, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
	  console.log(place);
	  var infoName = document.getElementById('infoName');
	  infoName.innerHTML = place.name;
	  
	  var infoPrice = document.getElementById('infoPrice');
	  switch(place.price_level) {
		  case 1:
			  infoPrice.innerHTML = '<i class="fa fa-usd"></i>';
			  break;
		  case 2:
			  infoPrice.innerHTML = '<i class="fa fa-usd"></i><i class="fa fa-usd"></i>';
			  break;
		  case 3:
			  infoPrice.innerHTML = '<i class="fa fa-usd"></i><i class="fa fa-usd"></i><i class="fa fa-usd"></i>';
			  break;
		  default:
			  infoPrice.innerHTML = '<i class="fa fa-usd icon-invisible"></i>';
			  break;
	  } //switch
	  
	  var infoRatings = document.getElementById('infoRatings');
	  switch((place.rating * 2).toFixed() / 2) {
		  case 0:
			  infoRatings.innerHTML = '<i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
			  break;
		  case 0.5:
			  infoRatings.innerHTML = '<i class="fa fa-star-half-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
			  break;
		  case 1:
			  infoRatings.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
			  break;
		  case 1.5:
			  infoRatings.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star-half-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
			  break;
		  case 2:
			  infoRatings.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
			  break;
		  case 2.5:
			  infoRatings.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
			  break;
		  case 3:
			  infoRatings.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
			  break;
		  case 3.5:
			  infoRatings.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half-o"></i><i class="fa fa-star-o"></i>';
			  break;
		  case 4:
			  infoRatings.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i>';
			  break;
		  case 4.5:
			  infoRatings.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half-o"></i>';
			  break;
		  case 5:
			  infoRatings.innerHTML = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>';
			  break;
		  default:
			  infoRatings.innerHTML = '<i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
			  break;
	  } //switch
	  
	  var infoMap = document.getElementById('infoMap');
	  
	  var infoOpen = document.getElementById('infoOpen');
	  if(place.opening_hours != undefined){
		  infoOpen.innerHTML = 'Open now: ' + place.opening_hours.open_now;
		  if(place.opening_hours.open_now == true){
		  		//infoOpen.innerHTML = '<i class="fa fa-sun-o"></i>' + 'Open Now';
				infoOpen.innerHTML = '<i class="fa fa-sun-o"></i>' + '<a data-toggle="collapse" href="#infoHours" aria-expanded="false" aria-controls="infoHours">Open Now</a>';
		  }
		  else{
		  		//infoOpen.innerHTML = '<i class="fa fa-moon-o"></i>' + 'Closed Now';
				infoOpen.innerHTML = '<i class="fa fa-moon-o"></i>' + '<a data-toggle="collapse" href="#infoHours" aria-expanded="false" aria-controls="infoHours">Closed Now</a>';
		  }
	  } else { infoOpen.innerHTML = ''; }
	  
	  
	  var carouselReviews = document.getElementById('inner-review-carousel');
	  if(place.reviews != undefined){  
		  for(var i = 0; i < place.reviews.length; i++) {
			  if(i==0){
				  var aDiv = document.createElement('div');
				  aDiv.className = 'item active';
			  } else {
				  aDiv = document.createElement('div');
				  aDiv.className = 'item';  
			  } //else
			  var bDiv = document.createElement('span');
			  bDiv.innerHTML = '( ' + (i+1) + '/' + place.reviews.length + ' ) <br>' + place.reviews[i].text;
			  aDiv.appendChild(bDiv);
			  carouselReviews.appendChild(aDiv);
		  } //for
	  } else if(place.reviews == undefined){
		  var aDiv = document.createElement('div');
		  aDiv.className = 'item active';
		  var bDiv = document.createElement('span');
		  bDiv.innerHTML = 'No reviews<br><br> ';
		  aDiv.appendChild(bDiv);
		  carouselReviews.appendChild(aDiv);
	  }
	 
	  /*
	  var infoReviews = document.getElementById('infoReviews');
	  infoReviews.innerHTML = '';
	  if(place.reviews != undefined){
		  for (var i = 0; i < place.reviews.length; i++) {
		  	  infoReviews.innerHTML += place.reviews[i].text + '<br><br>';
		  }
	  } else { infoReviews.innerHTML = ''; }
	  */
	  
	  var infoDelivery = document.getElementById('infoDelivery');
	  var isDelivery = false;
	  for (var i = 0; i < place.types.length; i++) {
	  	  if(place.types[i] == "meal_delivery"){
			  isDelivery = true;
	  	  }
	  }
	  if(isDelivery == true){
	  		infoDelivery.innerHTML = '<i class="fa fa-car"></i>' + 'Delivery Available';
	  }
	  else{
	  		infoDelivery.innerHTML = 'No Delivery Available';
	  }
	  
	  /*
	  var infoTakeout = document.getElementById('infoTakeout');
	  var isTakeout = false;
	  for (var i = 0; i < place.types.length; i++) {
	  	  if(place.types[i] == "meal_takeaway"){
			  isTakeout = true;
	  	  }
	  }
	  infoTakeout.innerHTML = 'Takeout: ' + isTakeout;
	  */
	  
	  var infoAddress = document.getElementById('infoAddress');
	  infoAddress.innerHTML = place.formatted_address;
	  
	  var infoPhone = document.getElementById('infoPhone');
	  if(place.formatted_phone_number != undefined) {
	  	infoPhone.innerHTML = '<a href="tel:+'+ place.formatted_phone_number+'">' + place.formatted_phone_number + '</a>';
	  } else { infoPhone.innerHTML = ''; }
	  
	  var infoWebsite = document.getElementById('infoWebsite');
	  if(place.website != undefined) {
	  	infoWebsite.innerHTML = 'Menu: <a href="' + place.website + '">Visit Website</a>';
	  
	  } else { infoWebsite.innerHTML = ''; }
	  
	  var infoHours = document.getElementById('infoHours');
	  infoHours.className = "collapse";
	  if(place.opening_hours != undefined){
	  	infoHours.innerHTML = place.opening_hours.weekday_text[0] + '<br>' + 
	  		place.opening_hours.weekday_text[1] + '<br>' + place.opening_hours.weekday_text[2] +
	    	'<br>' + place.opening_hours.weekday_text[3] + '<br>' + place.opening_hours.weekday_text[4] + 
	    	'<br>' + place.opening_hours.weekday_text[5] + '<br>' + place.opening_hours.weekday_text[6] + 
		  '<br>';
	  } else { infoHours.innerHTML = ''; }
	  
	  
	  var elem = document.getElementById('insidePhotos');
	  elem.parentNode.removeChild(elem);
	  
	  var insidePhotos = document.createElement('div');
	  insidePhotos.id = 'insidePhotos';
	  
	  var infoPhotos = document.getElementById('infoPhotos');
	  infoPhotos.appendChild(insidePhotos);
	  
	  var photos = place.photos;
	  console.log(place.photos);
	  console.log(place.photos.length);
	  if(place.photos != undefined){
	  	for(var i=0; i<place.photos.length ;i++){
			var img = document.createElement('div');
			img.innerHTML = '<img src="' + photos[i].getUrl({'maxWidth': 500, 'maxHeight': 500}) + '" id="addtnImgs"></img>';
			
			/*
		  	var img = document.createElement('img');
			img.src = photos[i].getURL({'maxWidth': 50, 'maxHeight': 50});
			img.id = 'additionalImgs';
			*/
			
			insidePhotos.appendChild(img);
	  	}
	   } else { console.log('No photos'); }
	  
  }
}

function checkOpenNow(checkbox)
{
	console.log('checkOpenNow');
    if (checkbox.checked)
    {
        alert("checked");
    } else {
		alert("unchecked");
	}
}

function getDistance(destinationA){
	var service = new google.maps.DistanceMatrixService();
	service.getDistanceMatrix(
  	  {
  	   origins: [currentPosition],
  	   destinations: [destinationA],
   	   travelMode: google.maps.TravelMode.DRIVING,
       unitSystem: google.maps.UnitSystem.IMPERIAL,
       durationInTraffic: false,
   	   avoidHighways: false,
   	   avoidTolls: false,
  }, getDistance_callback);
}

function getDistance_callback(response, status) {
  if (status == google.maps.DistanceMatrixStatus.OK) {
    var origins = response.originAddresses;
    //var destinations = response.destinationAddresses;

    for (var i = 0; i < origins.length; i++) {
      var results = response.rows[i].elements;
      for (var j = 0; j < results.length; j++) {
        var element = results[j];
        var distance = element.distance.text;
		//var test = document.getElementById(placeID);
		//test.innerHTML = distance;
		
		//distanceArray.push(distance);
		//console.log('+' + distanceArray);
		
        //var duration = element.duration.text;
        //var from = origins[i];
        //var to = destinations[j];
      }
    }
  }
}

function putDistancesInArray(distance){
	distanceArray.push(distance);
}

google.maps.event.addDomListener(window, 'load', determineLocation);
let api_key = 'AIzaSyDlA_pTF7IbYhUehFHwmZZZW9Cs9GbVGS8';
let origin = "348 Cruisers Dr Polk City, FL 33868-5127";
let dest = "8325 Broadway St 202-66 Pearland, TX 77581-5772";
var x;
//google api does all the handling for you, so no need to do a standard request
//instead, the environment will be provided on Google's side, you just need
//to provide the layout through a callback function
var directionsService = new google.maps.DirectionsService();

var request = {
  origin      : origin.replace(" ","+"),
  destination : dest.replace(" ","+"),
  travelMode  : google.maps.DirectionsTravelMode.DRIVING  
};

directionsService.route(request, function(response, status) {
  console.log("sent")
    if ( status == google.maps.DirectionsStatus.OK ) {
      x = response;
    console.log( response.routes[0].legs[0].distance.value ); // the distance in metres
  }
  else {
      console.log("Error: "+ status);
  }
});

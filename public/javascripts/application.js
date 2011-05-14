
var Geotrack = (function() {
  
  // if i'm going to hardcode crap, it'll at least all be hardcoded in one place
  var routes = { 
    events_path: "/events"
  }
  
  var notice = function(msg) { 
    $('.notice').prepend($('<li/>').text(new Date() + ' -- ' + msg)); 
  }

  var monitor = (function() {
    var map, markers = {};
    
    var pusher = new Pusher('fe4b5a9f7f74654ea114');
    var channel = pusher.subscribe('geotrack');
    channel.bind('locate', function(data) {
      data = eval(data);
      var loc = new google.maps.LatLng(data.lat, data.lng);
      map.setCenter(loc);
      if (markers[data.name]) markers[data.name].setMap(null);
      markers[data.name] = new google.maps.Marker({position: loc, map: map, title: data.name});
      notice('received location: ' + data.name + ' at ' + data.lat + ', ' + data.lng);
    });
    
    return {
      init: function() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 20, mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        
      }
    }
  })();
  
  var tracker = (function() {
    
    var getLocationTimeout;
    var getLocation = function() {
      navigator.geolocation.getCurrentPosition(storeLocation, function() { notice("Couldn't get your location. :(") });
      getLocationTimeout = setTimeout(getLocation, 5000);
    }

    var storeLocation = function(location) {
      var lat = location.coords.latitude, lng = location.coords.longitude;
      $.post(routes.events_path, {latitude: lat, longitude: lng, name: $('#name').val()}, function(resp) {
        notice("Got your location");
      })
    };
    
    return {
      init: function() {
        $('.toggle').toggle(
          function() {
            if (navigator.geolocation) {
              getLocation();
            } else {
              notice("Your browser doesn't support location reporting.");
            }

            $(this).text('stop updating');
          },
          function() { 
            clearTimeout(getLocationTimeout); 
            $(this).text('start updating');
          }
        );
        
        $('#name_entry').change(function() {
          $('#name').val($(this).val());
        });
      }
    }
  })();
  
  return {monitor: monitor, tracker: tracker};
})();

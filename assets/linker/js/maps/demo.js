! function($) {

    $(function() {
        map = new GMaps({
            div: '#mapa',
            lat: 10.6335502,
            lng: -71.6769433,
            zoom: 13
        });

        GMaps.geolocate({
            success: function(position) {
                map.setCenter(position.coords.latitude, position.coords.longitude);
            },
            error: function(error) {
                alert('Geolocation failed: ' + error.message);
            },
            not_supported: function() {
                alert("Your browser does not support geolocation");
            },
            always: function() {
                //alert("Done!");
            }
        });

        map.addMarker({
            lat: 37.77493,
            lng: -122.419416,
            title: 'Marker',
            infoWindow: {
                content: 'Info content here...'
            }
        });


    });
}(window.jQuery);
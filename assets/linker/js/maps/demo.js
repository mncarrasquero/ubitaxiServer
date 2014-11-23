!function ($) {

  $(function(){
		map = new GMaps({
			div: '#gmap_geocoding',
			lat: 37.77493,
			lng: -122.419416,
			zoom: 4
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
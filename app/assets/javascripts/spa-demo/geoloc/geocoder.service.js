(function() {
  'use strict';

  angular
    .module('spa-demo.geoloc')
    .service('spa-demo.geoloc.geocoder', Geocoder);

  Geocoder.$inject = ['$resource', 'spa-demo.config.APP_CONFIG'];
  function Geocoder($resource, APP_CONFIG) {
    var addresses = $resource(APP_CONFIG.server_url+"/api/geocoder/addresses", {}, { get: { cache: true } });
    var positions = $resource(APP_CONFIG.server_url+"/api/geocoder/positions", {}, { get: {cache: true } });

    var service = this;
    service.getLocationByAddress = getLocationByAddress;
    service.getLocationByPosition = getLocationByPosition;

    return;

    function getLocationByAddress(address) {
      var result = addresses.get({address: address});
      console.log('locationByAddress=', result);
      return result;
    }

    function getLocationByPosition(position) {
      console.log('locationByPosition', this, position);
      var result = positions.get({lng: position.lng, lat: position.lat});
      console.log('locationByPosition=', result);
      return result;
    }
  }
})();
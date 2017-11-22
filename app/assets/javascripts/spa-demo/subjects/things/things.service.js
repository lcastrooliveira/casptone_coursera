(function() {
  'use strict';

  angular
    .module('spa-demo.subjects')
    .service('spa-demo.subjects.Thing', ThingFactory);

  ThingFactory.$inject = ['$resource', 'spa-demo.config.APP_CONFIG'];
  function ThingFactory($resource, APP_CONFIG) {
    var service = $resource(APP_CONFIG.server_url+'/api/things/:id', 
      {id: '@id'}, 
      {
        update: { method: 'PUT' },
        save: { method: 'POST' }
    });
    return service;
  }
})();
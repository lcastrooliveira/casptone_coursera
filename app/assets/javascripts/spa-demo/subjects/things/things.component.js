(function() {
  'use strict';

  angular
    .module('spa-demo.subjects')
    .component('sdThingSelector', {
      templateUrl: thingSelectorTemplateUrl,
      controller: ThingSelectorController,
      bindings: {
        authz: '<'
      }
    })
    .component('sdThingEditor', {
      templateUrl: thingEditorTemplateUrl,
      controller: ThingEditorController,
      bindings: {
        authz: '<'
      }
    });
  
  thingSelectorTemplateUrl.$inject = ['spa-demo.config.APP_CONFIG'];
  function thingSelectorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.thing_selector_html;
  }

  thingEditorTemplateUrl.$inject = ['spa-demo.config.APP_CONFIG'];
  function thingEditorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.thing_editor_html;
  }

  ThingSelectorController.$inject = ['$scope', '$stateParams', 'spa-demo.subjects.Thing'];
  function ThingSelectorController($scope, $stateParams, Thing) {
    var vm = this;
    if(!$stateParams.id) {
      vm.items = Thing.query();
    }

    vm.$onInit = function() {
      console.log('ThingSelectorController', $scope);
      console.log(vm.authz)      
      $scope.$watch(function() { return vm.authz.authenticated }, logged);
    };
    return;

    function logged(amILogged, wasILogged) {
      if(amILogged && !$stateParams.id) {
        vm.items = Thing.query();
      }
    }
  }

  ThingEditorController.$inject = ['$scope', '$state', '$stateParams', 
                                   '$q', 'spa-demo.subjects.Thing',
                                   'spa-demo.subjects.ThingImage'];
  function ThingEditorController($scope, $state, $stateParams, $q, Thing, ThingImage) {
    var vm = this;
    vm.create = create;
    vm.clear = clear;
    vm.update = update;
    vm.remove = remove;

    vm.$onInit = function() {
      console.log('ThingEditorController', $scope);
      if($stateParams.id) {
        reload($stateParams.id);
      } else {
        newResource();
      }
    };
    return;

    function reload(thingId) {
      var itemId = thingId ? thingId : vm.item.id;
      vm.images = ThingImage.query({thing_id: itemId});
      vm.images.$promise.then(
        function() {
          angular.forEach(vm.images, function(ti) {
            ti.originalPriority = ti.priority;
          });
        }
      );
      vm.item = Thing.get({id: $stateParams.id});
      $q.all([vm.images.$promise, vm.item.$promise]).catch(handleError);
    }

    function newResource() {
      vm.item = new Thing();
      return vm.item;
    }

    function clear() {
      newResource();
      $state.go('.', {id: null});
    }

    function create() {
      $scope.thingform.$setPristine();
      vm.item.errors = null;
      vm.item.$save().then(
        function() {
          $state.go('.', { id: vm.item.id });
        }, handleError
      );
    }

    function update() {
      $scope.thingform.$setPristine();
      vm.item.errors = null;
      vm.item.$update().then(
        function() {
          $state.reload();
        }, handleError
      );
    }

    function remove() {
      vm.item.errors = null;
      vm.item.$delete().then(
        function() {
          clear();
        }, handleError
      );
    }

    function handleError(response) {
      if(response.data) {
        vm.item['errors'] = response.data.errors;
      }
      if(!vm.item.errors) {
        vm.item['errors'] = {}
        vm.item['errors']['full_messages'] = [response];
      }
    }
  }
})();
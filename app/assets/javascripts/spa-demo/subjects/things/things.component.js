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
      },
      require: {
        thingsAuthz: "^sdThingsAuthz"
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

  ThingSelectorController.$inject = ['$scope', '$stateParams', 
                                     'spa-demo.authz.Authz',
                                     'spa-demo.subjects.Thing'];
  function ThingSelectorController($scope, $stateParams, Authz, Thing) {
    var vm = this;

    vm.$onInit = function() {
      console.log('ThingSelectorController', $scope);
      $scope.$watch(function() { return Authz.getAuthorizedUserId(); },
                    function() {
                      if(!$stateParams.id) {
                        vm.items = Thing.query();
                      }
                    })
      //$scope.$watch(function() { return vm.authz.authenticated }, logged);
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
                                   'spa-demo.authz.Authz',
                                   'spa-demo.subjects.ThingImage'];
  function ThingEditorController($scope, $state, $stateParams, $q, Thing, Authz, ThingImage) {
    var vm = this;
    vm.create = create;
    vm.clear = clear;
    vm.update = update;
    vm.remove = remove;
    vm.haveDirtyLinks = haveDirtyLinks;
    vm.updateImageLinks = updateImageLinks;

    vm.$onInit = function() {
      console.log('ThingEditorController', $scope);
      $scope.$watch(function() { return Authz.getAuthorizedUserId(); },
                    function() {
                      if($stateParams.id) {
                        reload($stateParams.id);
                      } else {
                        newResource();
                      }
                    });
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
      vm.thingsAuthz.newItem(vm.item);
      $q.all([vm.images.$promise, vm.item.$promise]).catch(handleError);
    }

    function haveDirtyLinks() {
      for(var i = 0; vm.images && i < vm.images.length; i++) {
        var ti = vm.images[i];
        if(ti.toRemove || ti.originalPriority != ti.priority) {
          return true;
        }
      }
      return false;
    }

    function newResource() {
      vm.item = new Thing();
      vm.thingsAuthz.newItem(vm.item);
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
      var update = vm.item.$update();
      updateImageLinks(update);
    }

    function updateImageLinks(promise) {
      console.log('updating links to images');
      var promises = [];
      if(promise) { promises.push(promise); }
      angular.forEach(vm.images, function(ti) {
        if(ti.toRemove) {
          promises.push(ti.$remove());
        } else if(ti.originalPriority != ti.priority) {
          promises.push(ti.$update());
        }
      });

      console.log('waiting for promises', promises);
      $q.all(promises).then(
        function(response) {
          console.log('promise.all response', response);
          $scope.thingform.$setPristine();
          reload();
        }, handleError);
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
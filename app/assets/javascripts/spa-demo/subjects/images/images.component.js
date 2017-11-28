(function() {
  'use strict';

  angular
    .module('spa-demo.subjects')
    .component('sdImageSelector', {
      templateUrl: imageSelectorTemplateUrl,
      controller: ImageSelectorController,
      bindings: {
        authz: '<'
      }
    })
    .component('sdImageEditor', {
      templateUrl: imageEditorTemplateUrl,
      controller: ImageEditorController,
      bindings: {
        authz: '<'
      }, 
      require: {
        imagesAuthz: '^sdImagesAuthz'
      }
    });
  
  imageSelectorTemplateUrl.$inject = ['spa-demo.config.APP_CONFIG'];
  function imageSelectorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.image_selector_html;
  }

  imageEditorTemplateUrl.$inject = ['spa-demo.config.APP_CONFIG'];
  function imageEditorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.image_editor_html;
  }

  ImageSelectorController.$inject = ['$scope', '$stateParams', 
                                     'spa-demo.authz.Authz', 
                                     'spa-demo.subjects.Image'];
  function ImageSelectorController($scope, $stateParams, Authz, Image) {
    var vm = this;

    vm.$onInit = function() {
      console.log('ImageSelectorController', $scope);
      $scope.$watch(function() { return Authz.getAuthorizedUserId(); }, 
                   function() {
                    if(!$stateParams.id) {
                      vm.items = Image.query();
                    }
                   });
    };
    return;
  }

  ImageEditorController.$inject = ['$scope', '$state', 
                                   '$stateParams', '$q',
                                   'spa-demo.authz.Authz',
                                   'spa-demo.subjects.Image',
                                   'spa-demo.subjects.ImageThing',
                                   'spa-demo.subjects.ImageLinkableThing'];
  function ImageEditorController($scope, $state, $stateParams, 
                                 $q, Authz, Image, ImageThing, ImageLinkableThing) {
    var vm = this;
    vm.selected_linkables = [];
    vm.create = create;
    vm.clear = clear;
    vm.update = update;
    vm.remove = remove;
    vm.linkThings = linkThings;

    vm.$onInit = function() {
      console.log('ImageEditorController', $scope);
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

    function newResource() {
      console.log('new resource');
      vm.item = new Image();
      vm.imagesAuthz.newItem(vm.item);
      return vm.item;
    }

    function reload(imageId) {
      var itemId = imageId ? imageId : vm.item.id;
      vm.item = Image.get({id: itemId});
      vm.things = ImageThing.query({image_id: itemId});
      vm.linkable_things = ImageLinkableThing.query({image_id: itemId});
      vm.imagesAuthz.newItem(vm.item);
      $q.all([vm.item.$promise, vm.linkable_things.$promise, vm.things.$promise]).catch(handleError);
    }

    function clear() {
      newResource();
      $state.go('.', {id: null});
    }

    function create() {
      vm.item.errors = null;
      vm.item.$save().then(
        function() {
          $state.go('.', { id: vm.item.id });
        }, handleError
      );
    }

    function update() {
      vm.item.errors = null;
      var update = vm.item.$update();
      linkThings(update);
    }

    function linkThings(parentPromise) {
      var promises = [];
      if(parentPromise) { promises.push(parentPromise); }
      angular.forEach(vm.selected_linkables, function(linkable) {
        var resource = ImageThing.save({image_id: vm.item.id}, {thing_id: linkable});
        promises.push(resource.$promise);
      });
      vm.selected_linkables = [];
      console.log('waiting for promises', promises);
      $q.all(promises).then(function(response) {
        console.log("promise.all response", response);
        $scope.imageform.$setPristine();
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
      $scope.imageform.$setPristine();
    }
  }
})();
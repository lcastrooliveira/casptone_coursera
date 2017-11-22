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

  ImageSelectorController.$inject = ['$scope', '$stateParams', 'spa-demo.subjects.Image'];
  function ImageSelectorController($scope, $stateParams, Image) {
    var vm = this;
    if(!$stateParams.id) {
      vm.items = Image.query();
    }

    vm.$onInit = function() {
      console.log('ImageSelectorController', $scope);
    };
    return;
  }

  ImageEditorController.$inject = ['$scope', '$state', 
                                   '$stateParams', '$q',
                                   'spa-demo.subjects.Image',
                                   'spa-demo.subjects.ImageThing',
                                   'spa-demo.subjects.ImageLinkableThing'];
  function ImageEditorController($scope, $state, $stateParams, 
                                 $q, Image, ImageThing, ImageLinkableThing) {
    var vm = this;
    vm.create = create;
    vm.clear = clear;
    vm.update = update;
    vm.remove = remove;

    if($stateParams.id) {
      reload($stateParams.id);
    } else {
      newResource();
    }

    vm.$onInit = function() {
      console.log('ImageEditorController', $scope);
    };
    return;

    function newResource() {
      vm.item = new Image();
      return vm.item;
    }

    function reload(imageId) {
      var itemId = imageId ? imageId : vm.item.id;
      vm.item = Image.get({id: itemId});
      vm.things = ImageThing.query({image_id: itemId});
      $q.all([vm.item.$promise, vm.things.$promise]).catch(handleError);
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
      vm.item.$update().then(
        function() {
          $state.reload();
          $scope.imageform.$setPristine();
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
      $scope.imageform.$setPristine();
    }
  }
})();
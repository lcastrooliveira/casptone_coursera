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

  ImageEditorController.$inject = ['$scope', '$state', '$stateParams', 'spa-demo.subjects.Image'];
  function ImageEditorController($scope, $state, $stateParams, Image) {
    var vm = this;
    vm.create = create;
    vm.clear = clear;
    vm.update = update;
    vm.remove = remove;

    if($stateParams.id) {
      vm.item = Image.get({id: $stateParams.id});
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

    function clear() {
      newResource();
      $state.go('.', {id: null});
    }

    function create() {
      $scope.imageform.$setPristine();
      vm.item.errors = null;
      vm.item.$save().then(
        function() {
          $state.go('.', { id: vm.item.id });
        }, handleError
      );
    }

    function update() {
      $scope.imageform.$setPristine();
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
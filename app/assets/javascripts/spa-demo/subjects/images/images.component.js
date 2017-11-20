(function() {
  'use strict';

  // Usage:
  // 
  // Creates:
  // 

  angular
    .module('spa-demo.subjects')
    .component('sdImageSelector', {
      templateUrl: imageSelectorTemplateUrl,
      
      controller: ImageSelectorController
    });
  
  imageSelectorTemplateUrl.$inject = ['spa-demo.config.APP_CONFIG'];
  function imageSelectorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.image_selector_html;
  }

  ImageSelectorController.$inject = ['$scope', '$stateParams', 'spa-demo.subjects.Image'];
  function ImageSelectorController($scope, $stateParams, Image) {
    var vm = this;
    if(!$stateParams.id) {
      vm.items = Image.query();
    }

    ////////////////

    vm.$onInit = function() {
      console.log('ImageSelectorController', $scope);
    };
    return;
  }
})();
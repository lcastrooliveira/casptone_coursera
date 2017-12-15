(function() {
  'use strict';

  angular
    .module('spa-demo.layout')
    .component('sdImageLoader', {
      templateUrl: templateUrl,
      controller: ImageLoaderController,
      bindings: {
        resultDataUri: '&'
      },
      transclude: true
    });

  templateUrl.$inject= ['spa-demo.config.APP_CONFIG'];
  function templateUrl(APP_CONFIG) {
    return APP_CONFIG.image_loader_html;
  }

  ImageLoaderController.$inject = ['$scope'];
  function ImageLoaderController($scope) {
    var vm = this;
    vm.debug = debug;
    
    vm.$onInit = function() { 
      console.log('ImageLoaderController', $scope);
      $scope.$watch(function() { return vm.dataUri }, 
                    function() { vm.resultDataUri({ dataUri: vm.dataUri }); });
    };

    return;

    // function makeDataUri() {
    //   vm.dataUri=null;
    //   if(vm.file) {
    //     UploadDataUrl.dataUrl(vm.file, true).then(
    //       function(dataUri) {
    //         vm.dataUri = dataUri;
    //         console.log("created data Uri", vm.file, vm.dataUri.length);
    //         vm.resultDataUri({dataUri: vm.dataUri})
    //       }
    //     );
    //   }
    // }

    // function makeObjectUrl() {
    //   vm.makeObjectUrl = null;
    //   if(vm.file) {
    //     UploadDataUrl.dataUrl(vm.file, false).then(
    //       function(objectUrl) {
    //         vm.objectUrl = objectUrl;
    //         console.log("create object url", vm.file, vm.objectUrl);
    //       }
    //     );
    //   }
    // }

    function debug() {
      console.log('ImageLoaderController', $scope);
    }
  }
})();
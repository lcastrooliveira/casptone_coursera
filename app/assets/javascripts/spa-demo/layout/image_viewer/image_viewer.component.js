(function() {
  'use strict';

  angular
    .module('spa-demo.layout')
    .component('sdImageViewer', {
      templateUrl: templateUrl,
      controller: ImageViewerController,
      bindings: {
        name: '@',
        images: '<',
      },
    });

  templateUrl.$inject = ['spa-demo.config.APP_CONFIG'];
  function templateUrl(APP_CONFIG) {
    return APP_CONFIG.image_viewer_html;
  }

  ImageViewerController.$inject = ['$scope'];
  function ImageViewerController($scope) {
    var vm = this;
    vm.imageUrl = imageUrl;
    vm.imageId = imageId;
    vm.imageCaption = imageCaption;
    vm.isCurrentIndex = isCurrentIndex;
    vm.nextImage = nextImage;
    vm.previousImage = previousImage;
    
    vm.$onInit = function() {
      vm.currentIndex = 0; 
      console.log(vm.name, 'ImageViewerController', $scope);
    };
    return;

    ////////////////

    function nextImage() {
      setCurrentIndex(vm.currentIndex+1);
    }

    function previousImage() {
      setCurrentIndex(vm.currentIndex-1);
    }

    function isCurrentIndex(index) {
      return index == vm.currentIndex;
    }

    function setCurrentIndex(index) {
      console.log('setCurrentIndex', vm.name, index);
      if(vm.images && vm.images.length > 0) {
        if(index >= vm.images.length) {
          vm.currentIndex = 0;
        } else if(index <  0) {
          vm.currentIndex = vm.images.length-1;
        } else {
          vm.currentIndex = index;
        }
      } else {
        vm.currentIndex = 0;
      }
    }

    function imageCaption(object) {
      if(!object) { return null }
      var caption = object.image_id ? object.image_caption : object.caption;
      return caption;
    }

    function imageId(object) {
      if(!object) { return null }
      var id = object.image_id ? object.image_id : object.id;
      return id;
    }

    function imageUrl(object) {
      if(!object) { return null }
      var url = object.image_id ? object.image_content_url : object.content_url;
      console.log(vm.name,'url=', url);
      return url;
    }
  }
})();
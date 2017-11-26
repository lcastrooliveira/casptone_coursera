(function() {
  'use strict';

  angular
    .module('spa-demo.subjects')
    .directive('sdImagesAuthz', ImagesAuthz);

  ImagesAuthz.$inject = [];
  function ImagesAuthz() {
    var directive = {
        bindToController: true,
        controller: ImagesAuthzController,
        controllerAs: 'vm',
        link: link,
        restrict: 'A',
        scope: {
          authz: '=' // updates parent scope with authz evals
        }
    };
    return directive;
    
    function link(scope, element, attrs) {
      console.log('ImagesAuthzDirective', scope);
    }
  }
  
  ImagesAuthzController.$inject = ['$scope', 'spa-demo.subjects.ImagesAuthz'];
  function ImagesAuthzController ($scope, ImagesAuthz) {
    var vm = this;
    vm.authz = {};
    vm.authz.authenticated = false;
    vm.authz.canCreate = false;
    vm.authz.canQuery = false;
    vm.authz.canUpdate = false;
    vm.authz.canDelete = false;
    vm.authz.canGetDetails = false;
    vm.authz.canUpdateItem = canUpdateItem;

    ImagesAuthzController.prototype.resetAccess = function() {
      this.authz.canCreate = false;
      this.authz.canQuery = true;
      this.authz.canUpdate = false;
      this.authz.canDelete = false;
      this.authz.canGetDetails = true;
    }

    activate();
    return ;

    function activate() {
      vm.resetAccess();
      newUser();
    }

    function newUser(user, prevUser) {
      console.log('newUser=', user, 'prevUser=', prevUser);
      vm.authz.canQuery = true;
      vm.authz.authenticated = ImagesAuthz.isAuthenticated();
      if(vm.authz.authenticated) {
        vm.authz.canCreate = true;
        vm.authz.canUpdate = true;
        vm.authz.canDelete = true;
        vm.authz.canGetDetails = true;
      } else {
        vm.resetAccess();
      }
    }

    function canUpdateItem(item) {
      return ImagesAuthz.isAuthenticated();
    }
  }
})();
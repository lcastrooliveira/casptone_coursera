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
    vm.authz.canUpdateItem = canUpdateItem;
    vm.newItem = newItem;

    activate();
    return ;

    function newItem(item) {
      ImagesAuthz.getAuthorizedUser().then(
        function(user) { authzUserItem(item, user); },
        function(user) { authzUserItem(item, user); }
      );
    }

    function authzUserItem(item, user) {
      console.log('new Item/Authz', item, user);

      vm.authz.authenticated = ImagesAuthz.isAuthenticated();
      vm.authz.canQuery = ImagesAuthz.canQuery();
      vm.authz.canCreate = ImagesAuthz.canCreate();
      if(item && item.$promise) {
        item.$promise.then(function() { checkAccess(item) });
      } else {
        checkAccess(item);
      }
    }

    function checkAccess(item) {
      vm.authz.canUpdate = ImagesAuthz.canUpdate(item);
      vm.authz.canDelete = ImagesAuthz.canDelete(item);
      vm.authz.canGetDetails = ImagesAuthz.canGetDetails(item);
      console.log('Check access', item, vm.authz);
    }

    function activate() {
      vm.newItem(null);
    }
    
    function canUpdateItem(item) {
      return ImagesAuthz.canUpdate(item);
    }
  }
})();
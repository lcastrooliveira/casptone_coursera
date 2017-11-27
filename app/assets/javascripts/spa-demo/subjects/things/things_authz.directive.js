(function() {
  'use strict';

  angular
    .module('spa-demo.subjects')
    .directive('sdThingsAuthz', ThingsAuthz);

  ThingsAuthz.$inject = [];
  function ThingsAuthz() {
    var directive = {
        bindToController: true,
        controller: ThingsAuthzController,
        controllerAs: 'vm',
        link: link,
        restrict: 'A',
        scope: {
          authz: '=' // updates parent scope with authz evals
        }
    };
    return directive;
    
    function link(scope, element, attrs) {
      console.log('ThingsAuthzDirective', scope);
    }
  }
  
  ThingsAuthzController.$inject = ['$scope', 'spa-demo.subjects.ThingsAuthz'];
  function ThingsAuthzController ($scope, ThingsAuthz) {
    var vm = this;
    vm.authz = {};
    vm.authz.canUpdateItem = canUpdateItem;
    vm.newItem = newItem;

    activate();
    return ;

    function activate() {
      vm.newItem(null);
    }

    function newItem(item) {
      ThingsAuthz.getAuthorizedUser().then(
        function(user) { authzUserItem(item, user); },
        function(user) { authzUserItem(item, user); }
      );
    }

    function authzUserItem(item, user) {
      console.log('new Item/Authz', item, user);
      vm.authz.authenticated = ThingsAuthz.isAuthenticated();
      vm.authz.canQuery = ThingsAuthz.canQuery();
      vm.authz.canCreate = ThingsAuthz.canCreate();
      if(item && item.$promise) {
        vm.authz.canUpdate = false;
        vm.authz.canDelete = false;
        vm.authz.canGetDetails = false;
        vm.authz.canUpdateImage = false;
        vm.authz.canRemoveImage = false;
        item.$promise.then(function() { checkAccess(item); });
      } else {
        checkAccess(item);
      }
    }

    function checkAccess(item) {
      vm.authz.canUpdate = ThingsAuthz.canUpdate(item);
      vm.authz.canDelete = ThingsAuthz.canDelete(item);
      vm.authz.canGetDetails = ThingsAuthz.canGetDetails(item);
      vm.authz.canUpdateImage = ThingsAuthz.canUpdateImage(item);
      vm.authz.canRemoveImage = ThingsAuthz.canRemoveImage(item);
      console.log('Check access', item, vm.authz);
    }

    function canUpdateItem(item) {
      return ThingsAuthz.canUpdate(item);
    }
  }
})();
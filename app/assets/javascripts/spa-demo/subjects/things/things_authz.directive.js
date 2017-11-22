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
  
  ThingsAuthzController.$inject = ['$scope', 'spa-demo.authn.Authn'];
  function ThingsAuthzController ($scope, Authn) {
    var vm = this;
    vm.authz = {};
    vm.authz.authenticated = false;
    vm.authz.canCreate = false;
    vm.authz.canQuery = false;
    vm.authz.canUpdate = false;
    vm.authz.canDelete = false;
    vm.authz.canGetDetails = false;
    vm.authz.canUpdateItem = canUpdateItem;

    ThingsAuthzController.prototype.resetAccess = function() {
      this.authz.canCreate = false;
      this.authz.canQuery = false;
      this.authz.canUpdate = false;
      this.authz.canDelete = false;
      this.authz.canGetDetails = false;
    }

    activate();
    return ;

    function activate() {
      vm.resetAccess();
      $scope.$watch(Authn.getCurrentUser, newUser);
    }

    function newUser(user, prevUser) {
      console.log('newUser=', user, 'prevUser=', prevUser);
      vm.authz.authenticated = Authn.isAuthenticated();
      if(vm.authz.authenticated) {
        vm.authz.canCreate = true;
        vm.authz.canQuery = true;
        vm.authz.canUpdate = true;
        vm.authz.canDelete = true;
        vm.authz.canGetDetails = true;
      } else {
        vm.resetAccess();
      }
    }

    function canUpdateItem(item) {
      return Authn.isAuthenticated();
    }
  }
})();
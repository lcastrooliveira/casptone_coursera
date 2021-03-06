(function() {
    'use strict';

    angular
        .module('spa-demo.authn')
        .component('sdSignup', {
            templateUrl: templateUrl,
            controller: SignupController
        });

    templateUrl.$inject = ['spa-demo.config.APP_CONFIG'];
    function templateUrl(APP_CONFIG) {
        return APP_CONFIG.authn_signup_html;
    }
    
    SignupController.$inject = ['$scope', '$state', 'spa-demo.authn.Authn'];
    function SignupController($scope, $state, Authn) {
        var vm = this;
        vm.signupForm = {}
        vm.signup = signup;
        

        ////////////////

        vm.$onInit = function() {
            console.log('SignupController', $scope);
         };
        return;

        function signup() {
            $scope.signup_form.$setPristine();
            Authn.signup(vm.signupForm).then(
                function(response) {
                    vm.id = response.data.data.id;
                    console.log('singup complete', response.data, vm);
                    $state.go('home');
                },
                function(response) {
                    console.error('signup failure', response, vm);
                    vm.signupForm['errors'] = response.data.errors;
                }
            );
        }
    }
})();
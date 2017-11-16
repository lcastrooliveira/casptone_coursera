(function() {
    'use strict';

    angular
        .module('spa-demo.authn')
        .service('spa-demo.authn.Authn', Authn);

    Authn.$inject = ['$auth'];
    function Authn($auth) {
        var service = this;
        service.signup = signup;

        service.isAuthenticated = isAuthenticated;
        service.getCurrentUserName = getCurrentUserName;
        service.getCurrentUser = getCurrentUser;
        service.login = login;
        
        return;

        function signup(registration) {
            return $auth.submitRegistration(registration);
        }

        function login(credentials) {
            console.log('login', credentials.email);
            var result = $auth.submitLogin({
                email: credentials['email'],
                password: credentials['password']
            });
            result.then(
                function(response) {
                    console.log('login complete');
                    service.user = response;
                }
            );

            return result;
        }

        function isAuthenticated() {
            return service.user && service.user['uid'];
        }

        function getCurrentUserName() {
            return service.user ? service.user.name : null;
        }

        function getCurrentUser() {
            return service.user;
        }
    }
})();
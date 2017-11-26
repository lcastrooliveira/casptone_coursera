(function() {
    'use strict';

    angular
        .module('spa-demo.subjects')
        .factory('spa-demo.subjects.ImagesAuthz', ImagesAuthzFactory);

    ImagesAuthzFactory.$inject = ['spa-demo.authz.Authz', 'spa-demo.authz.BasePolicy'];
    function ImagesAuthzFactory(Authz, BasePolicy) {
        function ImagesAuthz() {
            BasePolicy.call(this, 'Image');
        };

        ImagesAuthz.prototype = Object.create(BasePolicy.prototype);
        ImagesAuthz.constructor = ImagesAuthz;

        // Override and add additional methods
        ImagesAuthz.prototype.canCreate = function() {
            return Authz.isAuthenticated();
        };

        return new ImagesAuthz();
    }
})();
(function() {
    'use strict';

    angular
        .module('spa-demo.foos')
        .directive('sdFoos', FoosDirective);

    FoosDirective.$inject = ['spa-demo.APP_CONFIG'];
    function FoosDirective(APP_CONFIG) {
        
        var directive = {
            templateUrl: APP_CONFIG.foos_html,
            replace: true,
            bindToController: true,
            controller: "spa-demo.foos.FoosController",
            controllerAs: 'foosVM',
            link: link,
            restrict: 'E',
            scope: {}
        };
        return directive;
        
        function link(scope, element, attrs) {
            console.log("FoosDirective", scope);
        }
    }
    
})();
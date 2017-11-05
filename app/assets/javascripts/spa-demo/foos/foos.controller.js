(function() {
    'use strict';

    angular
        .module('spa-demo.foos')
        .controller('spa-demo.foos.FoosController', FoosController);

    FoosController.$inject = ['spa-demo.foos.Foo'];
    function FoosController(Foo) {
        var vm = this;
        vm.foos;
        vm.foo;

        vm.edit = edit;
        vm.create = create;
        vm.update = update;
        vm.remove = remove;

        activate();
        return;
        ////////////////
        function activate() { 
            newFoo();
            vm.foos = Foo.query();
        }

        function newFoo() {
            vm.foo = new Foo();
        }

        function handleError(response)  {
            console.error(response);
        }

        function edit(object) {
            vm.foo = object
        }

        function create() {
            vm.foo.$save()
            .then(function(response) {
                vm.foos.push(vm.foo);
                newFoo();
            })
            .catch(handleError);
        }

        function update() {
            vm.foo.$update()
            .then(function(response) {
                console.log(response);
            })
            .catch(handleError);
        }

        function remove() {
            vm.foo.$delete()
            .then(function(response) {
                // vm.foos = Foo.query();
                removeElement(vm.foos, vm.foo);
                newFoo();
            })
            .catch(handleError);
        }

        function removeElement(elements, element) {
            for(var i=0; i < elements.length; i++) {
                if(elements[i].id == element.id) {
                    elements.splice(i,1);
                    break;
                }
            }
        }
    }
})();
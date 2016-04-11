(function() {
  'use strict';

  angular
    .module('heischwumm')
    .controller('HomeController', HomeController);

  HomeController.$inject = [];
  function HomeController() {
    var vm = this;

    console.log('HomeController');
  }
})();

(function() {
  'use strict';

  angular
    .module('heischwumm')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$timeout', 'AareService', 'SbbService', 'WeatherService'];
  function HomeController($timeout, AareService, SbbService, WeatherService) {
    var vm = this;

    var timeTillReload = 300;
    var counterSpeed = 1000;

    vm.timer = 0;
    vm.date = null;
    vm.aare = null;
    vm.thun = null;
    vm.muri = null;
    vm.weather = null;
    vm.title = 'Home';
    vm.loaded = {};
    vm.loaded.aare = false;
    vm.loaded.thun = false;
    vm.loaded.muri = false;
    vm.loaded.weather = false;
    vm.init = init;
    vm.getDelayString = getDelayString;
    vm.getTimeCounter = getTimeCounter;
    vm.getDate = getDate;

    init();

    function init() {
      vm.date = new Date();
      counter();
      getAareData();
      getWeatherData();
      getSbbData();
    }

    function counter() {
      vm.timer++;
      if(vm.timer > timeTillReload) {
        vm.timer = 0;
        vm.date = new Date();
        init();
      } else {
        $timeout(function() {
          counter();
        }, counterSpeed);
      }
    }

    function getDelayString(delay) {
      if(delay) {
        return '(+' + delay + ')';
      }
    }

    function getAareData() {
      vm.loaded.aare = false;
      AareService.getCurrentInformation()
        .success(function(data, status) {
          vm.aare = data;
        })
        .error(function(data, status) {
          console.error(data || 'Request failed');
        })
        .finally(function() {
          vm.loaded.aare = true;
        });
    }

    function getWeatherData() {
      WeatherService.getCurrentWeather()
        .success(function(data, status) {
          vm.weather = data;
        })
        .error(function(data, status) {
          console.error(data || 'Request failed');
        })
        .finally(function() {
          vm.loaded.weather = true;
        });
    }

    function getSbbData() {
      SbbService.getCurrentConnection('Gümligen', 'Thun')
        .success(function(data, status) {
          vm.thun = data;
        })
        .error(function(data, status) {
          console.error(data || 'Request failed');
        })
        .finally(function() {
          vm.loaded.thun = true;
        });

      SbbService.getCurrentConnection('Gümligen', 'Muri bei Bern')
        .success(function(data, status) {
          vm.muri = data;
        })
        .error(function(data, status) {
          console.error(data || 'Request failed');
        })
        .finally(function() {
          vm.loaded.muri = true;
        });
    }

    function getTimeCounter() {
      return Math.floor((timeTillReload - vm.timer) / 60) + ':' + (timeTillReload - vm.timer) % 60;
    }

    function getDate(date) {
      return new Date(date);
    }
  }
})();

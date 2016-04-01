(function() {
  'use strict';

  angular
    .module('heischwumm')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['AareService', 'SbbService', 'WeatherService'];
  function HomeController(AareService, SbbService, WeatherService) {
    var vm = this;
    vm.aare = null;
    vm.thun = null;
    vm.muri = null;
    vm.weather = null;
    vm.title = 'Home';
    vm.init = init;
    vm.getDelayString = getDelayString;

    init();

    function init() {
      getAareData();
      getWeatherData();
      getSbbData();
    }

    function getDelayString(delay) {
      if(delay) {
        return '(+' + delay + ')';
      }
    }

    function getAareData() {
      AareService.getCurrentInformation()
        .success(function(data, status) {
          vm.aare = data;
        })
        .error(function(data, status) {
          console.error(data || 'Request failed');
        });
    }

    function getWeatherData() {
      WeatherService.getCurrentWeather()
        .success(function(data, status) {
          vm.weather = data;
        })
        .error(function(data, status) {
          console.error(data || 'Request failed');
        });
    }

    function getSbbData() {
      SbbService.getCurrentConnection('Gümligen', 'Thun')
        .success(function(data, status) {
          vm.thun = data;
        })
        .error(function(data, status) {
          console.error(data || 'Request failed');
        });

      SbbService.getCurrentConnection('Gümligen', 'Muri bei Bern')
        .success(function(data, status) {
          vm.muri = data;
        })
        .error(function(data, status) {
          console.error(data || 'Request failed');
        });
    }
  }
})();

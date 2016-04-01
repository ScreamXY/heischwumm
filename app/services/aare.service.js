(function() {
  'use strict';

  angular
    .module('heischwumm')
    .factory('AareService', AareService);

  AareService.$inject = ['$http'];
  function AareService($http) {
    var service = {
      getCurrentInformation: getCurrentInformation
    };

    var url = 'http://aare.schwumm.ch/api/current';

    return service;

    ////////////////
    function getCurrentInformation() {
      return $http.get(url);
    }
  }
})();

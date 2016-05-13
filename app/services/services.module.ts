import AareService from 'app/services/aare.service';
import SbbService from 'app/services/sbb.service';
import WeatherService from 'app/services/weather.service';

export default angular
  .module('heischwumm.services', [])
  .factory('AareService', AareService)
  .factory('SbbService', SbbService)
  .factory('WeatherService', WeatherService);
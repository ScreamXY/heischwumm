import SbbController from 'app/sbb/sbb.controller';
import Connection from 'app/sbb/connection.directive';

export default angular
  .module('heischwumm.sbb', [
    'heischwumm.services'
  ])
  .controller('SbbController', SbbController)
  .directive('connection', Connection);
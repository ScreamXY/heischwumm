import HomeController from 'app/home/home.controller';

export default angular
  .module('heischwumm.home', [
    'heischwumm.services'
  ])
  .controller('HomeController', HomeController);
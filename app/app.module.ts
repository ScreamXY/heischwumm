import Routes from 'app/app.routes';
import AnimateConfig from 'app/app.config';
import home from 'app/home/home.module';
import sbb from 'app/sbb/sbb.module';
import services from 'app/services/services.module';

angular
  .module('heischwumm', [
    'ngRoute',
    'ngMaterial',
    home.name,
    sbb.name,
    services.name
  ])
  .config(Routes)
  .config(AnimateConfig);

angular.element(document).ready(() => {
  angular.bootstrap(document, ['heischwumm']);
});
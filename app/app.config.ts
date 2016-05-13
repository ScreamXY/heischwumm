AnimateConfig.$inject = ['$animateProvider'];
function AnimateConfig($animateProvider) {
$animateProvider.classNameFilter(/animate-/);
  }

export default AnimateConfig;
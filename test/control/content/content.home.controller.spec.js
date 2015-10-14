describe('Unit : people Plugin content.home.controller.js', function () {
  var ContentHome, $scope, $rootScope, $controller, buildfire, $q,TAG_NAMES, ERROR_CODE, Location,$sce,PeopleInfo,$location, $modal, $window, $timeout;
  beforeEach(module('peoplePluginWidget'));
  var editor;
  beforeEach(inject(function (_$rootScope_, _$q_,_Buildfire_, _$controller_,_TAG_NAMES_, _ERROR_CODE_, _Location_,_$sce_,_$location_, _$modal_, _$window_, _$timeout_) {
    $rootScope = _$rootScope_;
    $q = _$q_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    TAG_NAMES=_TAG_NAMES_;
    ERROR_CODE =_ERROR_CODE_;
    Location = _Location_;
    $sce = _$sce_;
    $location = _$location_;
    $modal = _$modal_;
    $window = _$window_;
    $timeout = _$timeout_;
    buildfire =_Buildfire_;
    Buildfire = { };
  }));

  beforeEach(function () {
    ContentHome = $controller('ContentHomeCtrl', {
      $scope: $scope,
      $q: $q,
      Buildfire: Buildfire
    });
  });

  describe('Units: units should be Defined', function () {
  });

xdescribe('$destroy', function () {
    it('should invoke when get $destroy', function () {
   //   $rootScope.$broadcast('$destroy');
    });
  });

});
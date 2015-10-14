describe('Unit : people Plugin widget.people.controller.js', function () {
  var WidgetHome, scope, $rootScope, $controller, Buildfire, q,TAG_NAMES, ERROR_CODE, Location,$sce,PeopleInfo,$location,$routeParams;
  beforeEach(module('peoplePluginWidget'));
  var editor;
  beforeEach(inject(function (_$rootScope_, _$q_, _$controller_,_TAG_NAMES_, _ERROR_CODE_, _Location_,_$sce_,_PeopleInfo_,_$location_,_$routeParams_) {
    $rootScope = _$rootScope_;
    q = _$q_;
    scope = $rootScope.$new();
    $controller = _$controller_;
    TAG_NAMES=_TAG_NAMES_;
    ERROR_CODE =_ERROR_CODE_;
    Location = _Location_;
    $sce = _$sce_;
    PeopleInfo = _PeopleInfo_;
    $location = _$location_;
    $routeParams=_$routeParams_;
    Buildfire = { };
  }));

  beforeEach(function () {
    WidgetHome = $controller('WidgetPeopleCtrl', {
      $scope: scope,
      $q: q,
      Buildfire: Buildfire
    });
  });

  describe('Units: units should be Defined', function () {
  });

});
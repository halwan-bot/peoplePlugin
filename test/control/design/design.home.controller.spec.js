describe('Unit : peoplePluginDesign design.home.controller.js', function () {
  var $scope, DesignHome, $rootScope, q, $controller;
  beforeEach(module('peoplePluginDesign'));

  beforeEach(inject(function (_$rootScope_, _$q_, _$controller_) {
    $rootScope = _$rootScope_;
    q = _$q_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
  }));

  beforeEach(function () {

    inject(function ($injector, $q) {
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      DesignHome = $injector.get('$controller')('DesignHomeCtrl', {
        $scope: $scope,
        data: {
          design: {
            listLayout: "",
            itemLayout: "",
            backgroundImage: ""
          },
          content: {
            images: [],
            description: ""
          }
        },
        Buildfire: {
          imageLib: {
            showDialog: function (options, callback) {
              DesignHome._callback(null, {selectedFiles: ['test']});
            }
          },
          components: {
            images: {
              thumbnail: function () {

              }
            }
          }
        }
      });
      q = $q;
    });
  });


})
;
'use strict';
(function (angular, buildfire) {
    angular
        .module('peoplePluginDesign', ['ngAnimate', 'ngRoute',  'ui.bootstrap'])
        .constant('TAG_NAMES', {
            PEOPLE_INFO: 'peopleInfo',
            PEOPLE: 'people'
        })
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'templates/home.html',
                    controllerAs: 'DesignHome',
                    controller: 'DesignHomeCtrl'
                })
                .otherwise('/');
        }])
        .factory('Buildfire', [function () {
            return buildfire;
        }])
        .directive('agInclude', function ($sce) {
            return {
                restrict: 'AE',
                replace: true,
                template: "<div ng-include='parsedUrl'></div>",
                scope: {
                    agInclude: "@"
                },
                link: function (scope, element, attrs) {
                    scope.parsedUrl = $sce.trustAsResourceUrl(attrs.agInclude);
                }
            }
        })
		.filter('getImageUrl', function () {
	      return function (url, width, height, type) {
	        if (type == 'resize')
	          return buildfire.imageLib.resizeImage(url, {
	            width: width,
	            height: height
	          });
	        else
	          return buildfire.imageLib.cropImage(url, {
	            width: width,
	            height: height
	          });
	      }
	    });

    angular.element(function() {
        var defaultProvider = 'datastore';
        buildfire.datastore.get('dbProvider', function(err, result) {
          try {
              if (err) throw err;
              window.DB_PROVIDER = result.data.provider
                ? result.data.provider
                : defaultProvider;
              angular.bootstrap(document, ['peoplePluginDesign']);
            } catch (err) {
              window.DB_PROVIDER = defaultProvider;
              angular.bootstrap(document, ['peoplePluginDesign']);
            }
        });
    })

})(window.angular, window.buildfire);

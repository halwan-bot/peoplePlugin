'use strict';
(function (angular, buildfire) {
    angular
        .module('peoplePluginDesign', ['ngAnimate', 'ngRoute'])
        .constant('TAG_NAMES', {
            PEOPLE_INFO: 'peopleInfo',
            PEOPLES: 'peoples'
        })
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/home.html',
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
        });
})(window.angular, window.buildfire);

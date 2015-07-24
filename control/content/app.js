'use strict';
(function (angular, buildfire) {

    angular
        .module('peoplePluginContent', ['ngAnimate', 'ngRoute'])
        .constant('TAG_NAMES', {
            PEOPLE_INFO: 'peopleInfo',
            PEOPLES: 'peoples'
        })
        .constant('ERROR_CODE', {
            NOT_FOUND: 'NOTFOUND'
        })
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/home.html',
                    controllerAs: 'ContentHome',
                    controller: 'ContentHomeCtrl'
                })
                .when('/peoples', {
                    templateUrl: '/peoples.html',
                    controllerAs: 'ContentPeoples',
                    controller: 'ContentPeoplesCtrl'
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

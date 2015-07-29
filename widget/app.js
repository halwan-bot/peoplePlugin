'use strict';

(function (angular, buildfire) {
    angular
        .module('peoplePluginWidget', ['ngAnimate', 'ngRoute', 'ui.bootstrap', 'ui.sortable'])
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
                    templateUrl: 'home/home.html',
                    controllerAs: 'WidgetHome',
                    controller: 'WidgetHomeCtrl'
                })
                .when('/peoples', {
                    templateUrl: 'peoples/peoples.html',
                    controllerAs: 'WidgetPeoples',
                    controller: 'WidgetPeoplesCtrl'
                })
                .otherwise('/');
        }])
        .factory('Buildfire', [function () {
            return buildfire;
        }])
        .factory('Location', [function () {
            var _location = window.location;
            return {
                goTo: function (path) {
                    _location.href = path;
                },
                goToHome: function () {
                    _location.href = _location.href.substr(0, _location.href.indexOf('#'));
                }
            };
        }]);
})(window.angular, window.buildfire);
'use strict';

(function (angular, buildfire) {
    angular
        .module('peoplePluginContent', ['ngAnimate', 'ngRoute', 'ui.bootstrap', 'ui.sortable'])
        .constant('TAG_NAMES', {
            PEOPLE_INFO: 'peopleInfo',
            PEOPLES: 'peoples'
        })
        .constant('ERROR_CODE', {
            NOT_FOUND: 'NOTFOUND'
        })
        .constant('STATUS_CODE', {
            INSERTED: 'inserted',
            UPDATED: 'updated'
        })
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'home/home.html',
                    controllerAs: 'ContentHome',
                    controller: 'ContentHomeCtrl'
                })
                .when('/peoples', {
                    templateUrl: 'peoples/peoples.html',
                    controllerAs: 'ContentPeoples',
                    controller: 'ContentPeoplesCtrl'
                })
                .otherwise('/');
        }])
        .factory('Buildfire', [function () {
            return buildfire;
        }]);
})(window.angular, window.buildfire);

'use strict';

(function (angular, buildfire) {
    angular
        .module('peoplePluginContent', ['ngAnimate', 'ngRoute', 'ui.bootstrap','ui.sortable','ngClipboard'])
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
        .config(['$routeProvider','ngClipProvider', function ($routeProvider,ngClipProvider) {
            ngClipProvider.setPath("//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.1.6/ZeroClipboard.swf");
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

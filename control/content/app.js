'use strict';

(function (angular,buildfire) {
    angular.module('peoplePluginContent', ['ngAnimate','ngRoute'])
        .constant('TAG_NAMES',{
            PEOPLE_INFO : 'peopleInfo',
            PEOPLES : 'peoples'
        })
        .constant('ERROR_CODE',{
            NOT_FOUND:'NOTFOUND'
        })
        .config(['$routeProvider',function ($routeProvider) {
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
        }]);
})(window.angular,buildfire);

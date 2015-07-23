'use strict';

(function (angular,buildfire) {
    angular.module('peoplePluginContent', ['ui.router', "ngAnimate"])
        .constant('TAG_NAMES',{
            PEOPLE_INFO : 'peopleInfo',
            PEOPLES : 'peoples'
        })
        .constant('ERROR_CODE',{
            NOT_FOUND:'NOTFOUND'
        })
        .config(['$urlRouterProvider','$stateProvider',function ($urlRouterProvider, $stateProvider) {
            $urlRouterProvider.otherwise('/content');
            $stateProvider
                .state('content', {
                    url: "/content",
                    templateUrl: "templates/content.html",
                    controllerAs: 'Content',
                    controller: 'ContentCtrl'
                })
                .state('content.home', {
                    url: "/home",
                    templateUrl: "templates/home.html",
                    controllerAs: 'ContentHome',
                    controller: 'ContentHomeCtrl'
                })
                .state('content.peoples', {
                    url: "/peoples",
                    templateUrl: "templates/peoples.html",
                    controllerAs: 'ContentPeoples',
                    controller: 'ContentPeoplesCtrl'
                });
        }])
        .factory('Buildfire', [function () {
            return buildfire;
        }]);
})(window.angular,buildfire);

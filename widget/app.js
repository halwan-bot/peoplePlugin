'use strict';

(function (angular, buildfire) {
    angular
        .module('peoplePluginWidget', ['ngAnimate', 'ngRoute', 'ui.bootstrap', 'ui.sortable','infinite-scroll'])
        .constant('TAG_NAMES', {
            PEOPLE_INFO: 'peopleInfo',
            PEOPLE: 'people'
        })
        .constant('ERROR_CODE', {
            NOT_FOUND: 'NOTFOUND'
        })
        .config(['$routeProvider', function ($routeProvider) {

            /**
             * Disable the pull down refresh
             */
            buildfire.datastore.disableRefresh();

            $routeProvider
                .when('/', {
                    templateUrl: 'templates/home.html',
                    controllerAs: 'WidgetHome',
                    controller: 'WidgetHomeCtrl'
                })
                .when('/people/:id', {
                    templateUrl: 'templates/people.html',
                    controllerAs: 'WidgetPeople',
                    controller: 'WidgetPeopleCtrl'
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
        }])
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
      })
      .run(function($rootScope,$location, Buildfire){
       /* Buildfire.messaging.onReceivedMessage = function(message){
          $location.path('/people/'+ message.id);
        };*/
      });
})(window.angular, window.buildfire);
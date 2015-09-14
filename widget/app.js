'use strict';

(function (angular, buildfire) {
    angular
        .module('peoplePluginWidget', [
            'peopleEnums',
            'peopleFilters',
            'peopleServices',
            'ngAnimate',
            'ngRoute',
            'ui.bootstrap',
            'infinite-scroll'
        ])
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
                    controller: 'WidgetHomeCtrl',
                    resolve: {
                        PeopleInfo: ['$q', 'DB', 'COLLECTIONS', 'Location', function ($q, DB, COLLECTIONS, Location) {
                            var deferred = $q.defer();
                            var PeopleInfo = new DB(COLLECTIONS.peopleInfo);
                            var _bootstrap = function () {
                                Location.goToHome();
                            };
                            PeopleInfo.get().then(function success(result) {
                                    if (result && result.data && result.data.content && result.data.design) {
                                        deferred.resolve(result);
                                    }
                                    else {
                                        //error in bootstrapping
                                        _bootstrap(); //bootstrap again  _bootstrap();
                                    }
                                },
                                function fail() {
                                    Location.goToHome();
                                }
                            );
                            return deferred.promise;
                        }]
                    }
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
      .directive("buildFireCarousel", ["$rootScope", function ($rootScope) {
        return {
          restrict: 'A',
          link: function (scope, elem, attrs) {
            $rootScope.$broadcast("Carousel:LOADED");
          }
        };
      }])
      .run(['Location',function(Location){
        buildfire.messaging.onReceivedMessage = function (msg) {
          switch(msg.type) {
            case 'AddNewItem':
              Location.goTo("#/people/" + msg.id + "?stopSwitch=true");
              break;
            case 'OpenItem':
              Location.goTo("#/people/" + msg.id);
              break;
            default:
              Location.goToHome();
          }
        };
        buildfire.deeplink.getData(function(data){
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
          console.log(data);
        });
      }]);
})(window.angular, window.buildfire);
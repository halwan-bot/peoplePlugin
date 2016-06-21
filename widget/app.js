'use strict';

(function (angular, buildfire) {
  angular
    .module('peoplePluginWidget', [
      'peopleEnums',
      'peopleFilters',
      'peopleWidgetServices',
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
    .config(['$routeProvider', '$compileProvider', function ($routeProvider, $compileProvider) {

      /**
       * To make href urls safe on mobile
       */
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|cdvfile|file):/);


      $routeProvider
        .when('/', {
          template: '<div></div>'
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
    .filter('getImageUrl', ['Buildfire', function (Buildfire) {
      filter.$stateful = true;
      function filter(url, width, height, type) {
        var _imgUrl;
        if (!_imgUrl) {
          if (type == 'resize') {
            Buildfire.imageLib.local.resizeImage(url, {
              width: width,
              height: height
            }, function (err, imgUrl) {
              _imgUrl = imgUrl;
            });
          } else {
            Buildfire.imageLib.local.cropImage(url, {
              width: width,
              height: height
            }, function (err, imgUrl) {
              _imgUrl = imgUrl;
            });
          }
        }

        return _imgUrl;
      }
      return filter;
    }])
    .directive("buildFireCarousel", ["$rootScope", function ($rootScope) {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          $rootScope.$broadcast("Carousel:LOADED");
        }
      };
    }])
    .directive("loadImage", ['$rootScope', function ($rootScope) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          element.attr("src", "../../../styles/media/holder-" + attrs.loadImage + ".gif");

          var previous_src=attrs.finalSrc;

          var elem = $("<img>");
          elem[0].onload = function () {
            element.attr("src", attrs.finalSrc);
            elem.remove();
          };

            function changeSrc(info) {
              if(previous_src!=attrs.finalSrc){
                console.log('previous_src in loadimage is different---loaded-------------------------------------',previous_src);
                element.attr("src", attrs.finalSrc);
                elem.remove();
              }
            }
            scope.$watch(function(val){
              console.log('Val in loadimage----------------------------------------',val);
              console.log('previous_src in loadimage----------------------------------------',previous_src);
                return attrs.finalSrc;
            }, changeSrc, true);
          elem.attr("src", attrs.finalSrc);
        }
      };
    }])
    .run(['Location', '$location', '$rootScope', function (Location, $location, $rootScope) {
      buildfire.messaging.onReceivedMessage = function (msg) {
        var currentUrl = $location.$$url;
        switch (msg.type) {
          case 'AddNewItem':
            Location.goTo("#/people/" + msg.id + "?stopSwitch=true");
            break;
          case 'OpenItem':
            Location.goTo("#/people/" + msg.id);
            break;
          default:
            if (currentUrl != '/') {
              Location.goToHome();
            }
        }
      };
      buildfire.deeplink.getData(function (data) {
        if (data) {
          Location.goTo("#/people/" + JSON.parse(data).id);
        }
      });

      buildfire.navigation.onBackButtonClick = function () {
        if (($location.path() != '/')) {
          buildfire.messaging.sendMessageToControl({});
          $rootScope.showHome = true;
          Location.goTo('#/');
        }
        else {
          buildfire.navigation._goBackOne();
        }
      };
    }]).filter('cropImage', [function () {
      function filter (url, width, height, noDefault) {
        var _imgUrl;
        filter.$stateful = true;
        if(noDefault)
        {
          if(!url)
            return '';
        }
        if (!_imgUrl) {
          buildfire.imageLib.local.cropImage(url, {
            width: width,
            height: height
          }, function (err, imgUrl) {
            _imgUrl = imgUrl;
          });
        }
        return _imgUrl;
      }
      return filter;
    }]);
})(window.angular, window.buildfire);
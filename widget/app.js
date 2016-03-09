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
      'infinite-scroll',
        'angularLazyImg'
    ])
      .config(['lazyImgConfigProvider', function(lazyImgConfigProvider){
        var scrollable = document.querySelector('#scrollable');
        lazyImgConfigProvider.setOptions({
          offset: 200, // how early you want to load image (default = 100)
          errorClass: 'error', // in case of loading image failure what class should be added (default = null)
          successClass: 'success', // in case of loading image success what class should be added (default = null)
          onError: function(image){}, // function fired on loading error
          onSuccess: function(image){}, // function fired on loading success
          container: angular.element(scrollable) // if scrollable container is not $window then provide it here
        });
      }])
    .constant('TAG_NAMES', {
      PEOPLE_INFO: 'peopleInfo',
      PEOPLE: 'people'
    })
    .constant('ERROR_CODE', {
      NOT_FOUND: 'NOTFOUND'
    })
    .config(['$routeProvider', '$compileProvider', function ($routeProvider, $compileProvider) {

      /**
       * Disable the pull down refresh
       */
      buildfire.datastore.disableRefresh();


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
    .directive("loadImage", [function () {
          return {
              restrict: 'A',
              link: function (scope, element, attrs) {
                  element.attr("src", ".images/" + attrs.loadImage + ".png");

                  var elem = $("<img>");
                      elem[0].onload = function () {
                          element.attr("src", attrs.finalSrc);
                          elem.remove();
                      };
                      elem.attr("src", attrs.finalSrc);
              }
          };
      }])
    .run(['Location', '$location','$rootScope', function (Location, $location,$rootScope) {
      buildfire.messaging.onReceivedMessage = function (msg) {
        var currentUrl=$location.$$url;
        switch (msg.type) {
          case 'AddNewItem':
            Location.goTo("#/people/" + msg.id + "?stopSwitch=true");
            break;
          case 'OpenItem':
            Location.goTo("#/people/" + msg.id);
            break;
          default:
              if(currentUrl!='/'){
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
        else{
            buildfire.navigation._goBackOne();
        }
      };
    }]).filter('cropImage', [function () {
        return function (url, width, height, noDefault) {
          if (noDefault) {
            if (!url)
              return '';
          }
          return buildfire.imageLib.cropImage(url, {
            width: width,
            height: height
          });
        };
      }]);
})(window.angular, window.buildfire);
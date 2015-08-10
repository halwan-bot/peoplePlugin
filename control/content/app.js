'use strict';

(function (angular, buildfire) {
    //created peoplePluginContent module
    angular
        .module('peoplePluginContent', ['ngAnimate', 'ngRoute', 'ui.bootstrap', 'ui.sortable', 'ngClipboard', 'infinite-scroll', "bngCsv"])
        //injected ngRoute for routing
        //injected ui.bootstrap for angular bootstrap component
        //injected ui.sortable for manual ordering of list
        //ngClipboard to provide copytoclipboard feature
        .constant('TAG_NAMES', {
            PEOPLE_INFO: 'peopleInfo',
            PEOPLE: 'people'
        })
        .constant('ERROR_CODE', {
            NOT_FOUND: 'NOTFOUND'
        })
        .constant('STATUS_CODE', {
            INSERTED: 'inserted',
            UPDATED: 'updated'
        })
        .config(['$routeProvider', 'ngClipProvider', function ($routeProvider, ngClipProvider) {
            ngClipProvider.setPath("//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.1.6/ZeroClipboard.swf");
            $routeProvider
                .when('/', {
                    templateUrl: 'home/home.html',
                    controllerAs: 'ContentHome',
                    controller: 'ContentHomeCtrl'
                })
                .when('/people', {
                    templateUrl: 'people/people.html',
                    controllerAs: 'ContentPeople',
                    controller: 'ContentPeopleCtrl'
                })
                .when('/people/:itemId', {
                    templateUrl: 'people/people.html',
                    controllerAs: 'ContentPeople',
                    controller: 'ContentPeopleCtrl'
                })
                .otherwise('/');
        }])
        .factory('Buildfire', [function () {
            return buildfire;
        }])
        .directive('fileReader', [function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.context.onchange = function (event) {

                        var files = event.target.files; //FileList object
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i];
                            var picReader = new FileReader();

                            picReader.addEventListener("load", function (event) {
                                var textFile = event.target;
                                scope.ImportCSVPopup[attrs.fileReader] = textFile.result;
                            });

                            //Read the text file
                            picReader.readAsText(file);
                        }

                    }

                }
            };
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
        .factory('RankOfLastItem', [function () {
            var _rankOfLastItem;
            return {
                getRank: function () {
                    return _rankOfLastItem;
                },
                setRank: function (value) {
                    _rankOfLastItem = value;
                }
            };
        }])
      .filter('truncate', function () {
        return function (text, length, end) {
          if (text) {
            if (isNaN(length))
              length = 10;

            if (length < 0)
              length = text.length;

            if (end === undefined)
              end = "...";

            if (text.length <= length || text.length - end.length <= length) {
              return text;
            }
            else {
              return String(text).substring(0, length - end.length) + end;
            }
          } else {
            return "";
          }
        }
      });
})(window.angular, window.buildfire);

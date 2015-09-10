'use strict';

(function (angular, buildfire) {
    //created peoplePluginContent module
    angular
        .module('peoplePluginContent', [
            'peopleEnums',
            'peopleFilters',
            'peopleServices',
            'ngAnimate',
            'ngRoute',
            'ui.bootstrap',
            'ui.sortable',
            'infinite-scroll',
            "ui.tinymce",
            "bngCsv"])
        //injected ngRoute for routing
        //injected ui.bootstrap for angular bootstrap component
        //injected ui.sortable for manual ordering of list
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
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'templates/home.html',
                    controllerAs: 'ContentHome',
                    controller: 'ContentHomeCtrl',
                    resolve: {
                        PeopleInfo: ['$q', 'DB', 'COLLECTIONS', 'Location', function ($q, DB, COLLECTIONS, Location) {
                            var deferred = $q.defer();
                            var PeopleInfo = new DB(COLLECTIONS.peopleInfo);
                            var _bootstrap = function () {
                                PeopleInfo.save({
                                    content: {
                                        images: [],
                                        description: '',
                                        sortBy: "Manually",
                                        rankOfLastItem: 0
                                    },
                                    design: {
                                        itemLayout: "item-layout-1",
                                        listLayout: "list-layout-1",
                                        backgroundImage: ''
                                    }
                                }).then(function success() {
                                    Location.goToHome();
                                }, function fail() {
                                    _bootstrap();
                                })
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
                .when('/people', {
                    templateUrl: 'templates/people.html',
                    controllerAs: 'ContentPeople',
                    controller: 'ContentPeopleCtrl'
                })
                .when('/people/:itemId', {
                    templateUrl: 'templates/people.html',
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
        })
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
        });
})(window.angular, window.buildfire);

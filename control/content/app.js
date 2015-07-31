'use strict';

(function (angular, buildfire) {
    angular
        .module('peoplePluginContent', ['ngAnimate', 'ngRoute', 'ui.bootstrap', 'ui.sortable', 'ngClipboard'])
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
                    controller: 'UpdateContentPeopleCtrl'
                })
                .otherwise('/');
        }])
        .factory('Buildfire', [function () {
            return buildfire;
        }])
        .factory('FormatConverter', [function () {
            return {
                CSV2JSON: function(csv) {
                    var array = CSVToArray(csv);
                    var objArray = [];
                    for (var i = 1; i < array.length; i++) {
                        objArray[i - 1] = {};
                        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
                            var key = array[0][k];
                            objArray[i - 1][key] = array[i][k]
                        }
                    }
                    var json = JSON.stringify(objArray);
                    var str = json.replace(/},/g, "},\r\n");

                    return str;
                },
                JSON2CSV: function(objArray) {
                    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
                    var str = '';
                    var line = '';
                    var head = array[0];
                    for (var index in array[0]) {
                        var value = index + "";
                        line += '"' + value.replace(/"/g, '""') + '",';
                    }
                    line = line.slice(0, -1);
                    str += line + '\r\n';
                    for (var i = 0; i < array.length; i++) {
                        var line = '';
                        for (var index in array[i]) {
                            if( typeof array[i][index]!='object'){
                            var value = array[i][index] + "";
                            line += '"' + value.replace(/"/g, '""') + '",';
                            }
                            else{
                                var value1=JSON.parse(angular.toJson(array[i][index]));
                                var line1='';
                                angular.forEach(value1,function(val){
                                    line1+=val.iconImageUrl+',';

                                });
                                line += '"' + line1.replace(/"/g, '""') + '",';
                            }
                        }
                        line = line.slice(0, -1);
                        str += line + '\r\n';
                    }
                    return str;
                }
            };
        }]);
})(window.angular, window.buildfire);

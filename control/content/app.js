'use strict';

(function (angular, buildfire) {
    //created peoplePluginContent module
    angular
        .module('peoplePluginContent', ['ngAnimate', 'ngRoute', 'ui.bootstrap', 'ui.sortable', 'ngClipboard'])
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
                    controller: 'UpdateContentPeopleCtrl'
                })
                .otherwise('/');
        }])
        .factory('Buildfire', [function () {
            return buildfire;
        }])
        .factory('FormatConverter', [function () {

            var CSVToArray=function(strData, strDelimiter) {
                // Check to see if the delimiter is defined. If not,
                // then default to comma.
                strDelimiter = (strDelimiter || ",");
                // Create a regular expression to parse the CSV values.
                var objPattern = new RegExp((
                    // Delimiters.
                    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                        // Quoted fields.
                        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                        // Standard fields.
                        "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
                // Create an array to hold our data. Give the array
                // a default empty first row.
                var arrData = [[]];
                // Create an array to hold our individual pattern
                // matching groups.
                var arrMatches = null;
                // Keep looping over the regular expression matches
                // until we can no longer find a match.
                while (arrMatches = objPattern.exec(strData)) {
                    // Get the delimiter that was found.
                    var strMatchedDelimiter = arrMatches[1];
                    // Check to see if the given delimiter has a length
                    // (is not the start of string) and if it matches
                    // field delimiter. If id does not, then we know
                    // that this delimiter is a row delimiter.
                    if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                        // Since we have reached a new row of data,
                        // add an empty row to our data array.
                        arrData.push([]);
                    }
                    // Now that we have our delimiter out of the way,
                    // let's check to see which kind of value we
                    // captured (quoted or unquoted).
                    if (arrMatches[2]) {
                        // We found a quoted value. When we capture
                        // this value, unescape any double quotes.
                        var strMatchedValue = arrMatches[2].replace(
                            new RegExp("\"\"", "g"), "\"");
                    } else {
                        // We found a non-quoted value.
                        var strMatchedValue = arrMatches[3];
                    }
                    // Now that we have our value string, let's add
                    // it to the data array.
                    arrData[arrData.length - 1].push(strMatchedValue);
                }
                // Return the parsed data.
                return (arrData);
            };

            return {
                CSV2JSON: function (csv) {
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
                JSON2CSV: function (objArray) {
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
                            if (typeof array[i][index] != 'object') {
                                var value = array[i][index] + "";
                                line += '"' + value.replace(/"/g, '""') + '",';
                            }
                            else {
                                var value1 = JSON.parse(angular.toJson(array[i][index]));
                                var line1 = '';
                                angular.forEach(value1, function (val) {
                                    line1 += val.iconImageUrl + ',';

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
        }])
        .directive('fileReader',[function () {
            return {
                restrict:'A',
                link:function(scope,element,attrs){
                    element.context.onchange=function(event){

                        var files = event.target.files; //FileList object
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i];
                            var picReader = new FileReader();

                            picReader.addEventListener("load", function(event) {
                                var textFile = event.target;
                                scope.ImportCSVPopup[attrs.fileReader]=textFile.result;
                            });

                            //Read the text file
                            picReader.readAsText(file);
                        }

                    }

                }
            };
        }]);
})(window.angular, window.buildfire);

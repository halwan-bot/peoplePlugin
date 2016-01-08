'use strict';

(function (angular, buildfire, location) {
  //created mediaCenterWidget module
  angular
    .module('peopleFiltersContent', [])
    .filter('resizeImage', [function () {
      return function (url, width, height, type) {
        return buildfire.imageLib.resizeImage(url, {
          width: width,
          height: height
        });
      }
    }])
    .filter('cropImage', [function () {
      return function (url, width, height, type) {
        return buildfire.imageLib.cropImage(url, {
          width: width,
          height: height
        });
      }
    }])
    .filter('truncate', function () {
      return function (text, length, end) {
        if (isNaN(length))
          length = 10;

        if (end === undefined)
          end = "...";

        if (text.length <= length || text.length - end.length <= length) {
          return text;
        }
        else {
          return String(text).substring(0, length - end.length) + end;
        }

      };
    });
})(window.angular, window.buildfire, window.location);
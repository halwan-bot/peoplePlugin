'use strict';

(function (angular) {
    angular.module('peoplePluginContent')
        .controller('ContentCtrl', ['$state', function ($state) {
            $state.go('content.home');
        }])
})(window.angular);

'use strict';

(function (angular) {
    angular
        .module('peoplePluginContent')
        .controller('ImportCSVPopupCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
            var ImportCSVPopup=this;
            ImportCSVPopup.ok = function (linkUrl) {
                $modalInstance.close(linkUrl);
            };
            ImportCSVPopup.cancel = function () {
                $modalInstance.dismiss('Dismiss');
            };
        }])
})(window.angular);

'use strict';

(function (angular) {
    angular
        .module('peoplePluginContent')
        .controller('AddImageLinkPopupCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
            var AddImageLinkPopup = this;
            AddImageLinkPopup.link = '';
            AddImageLinkPopup.ok = function (linkUrl) {
                $modalInstance.close(linkUrl);
            };
            AddImageLinkPopup.cancel = function () {
                $modalInstance.dismiss('Link Url not provided.');
            };
        }])
})(window.angular);

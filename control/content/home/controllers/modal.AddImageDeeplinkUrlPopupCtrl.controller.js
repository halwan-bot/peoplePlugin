'use strict';

(function (angular) {
    angular
        .module('peoplePluginContent')
        .controller('AddImageDeeplinkUrlPopupCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
            var _self=this;
            _self.deeplinkurl='';
            _self.ok = function (linkUrl) {
                $modalInstance.close(linkUrl);
            };
            _self.cancel = function () {
                $modalInstance.dismiss('Link Url not provided.');
            };
        }])
})(window.angular);

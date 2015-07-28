'use strict';

(function (angular) {
    angular
        .module('peoplePluginContent')
        .controller('AddCarouselImagePopupCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
            var _self = this;
            _self.imageInfo = {
                iconImageUrl: '',
                title: '',
                deepLinkUrl: ''
            };
            _self.ok = function (imageInfo) {
                console.error('---------------imageInfo------------------',imageInfo);
                imageInfo.iconImageUrl = imageInfo.iconImageUrl ? imageInfo.iconImageUrl : 'http://www.placehold.it/80x50';
                $modalInstance.close(imageInfo);
            };
            _self.cancel = function () {
                $modalInstance.dismiss('You have canceled.');
            };
        }])
})(window.angular);

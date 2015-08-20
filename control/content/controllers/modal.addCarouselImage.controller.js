'use strict';

(function (angular) {
    angular
        .module('peoplePluginContent')
        .controller('AddCarouselImagePopupCtrl', ['$scope', '$modalInstance', 'Buildfire', function ($scope, $modalInstance, Buildfire) {
            var AddCarouselImagePopup = this;
            AddCarouselImagePopup.imageInfo = {
                imageUrl: '',
                title: '',
                link: '',
                target: '_blank'
            };
            AddCarouselImagePopup.ok = function (imageInfo) {
                if (!imageInfo.imageUrl) {
                    return;
                }
                $modalInstance.close(imageInfo);
            };
            AddCarouselImagePopup.cancel = function () {
                $modalInstance.dismiss('You have canceled.');
            };
            var options = {showIcons: false, multiSelection: false};
            var callback = function (error, result) {
                if (error) {
                    console.error('Error:', error);
                } else {
                    AddCarouselImagePopup.imageInfo.imageUrl = result.selectedFiles && result.selectedFiles[0] || null;
                    $scope.$digest();
                }
            };

            AddCarouselImagePopup.selectImage = function () {
                Buildfire.imageLib.showDialog(options, callback);
            };
            AddCarouselImagePopup.removeImage = function () {
                AddCarouselImagePopup.imageInfo.imageUrl = null;
            };

        }])
})(window.angular);

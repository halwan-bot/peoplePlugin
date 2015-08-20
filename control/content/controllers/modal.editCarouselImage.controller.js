'use strict';

(function (angular) {
  angular
    .module('peoplePluginContent')
    .controller('EditCarouselImagePopupCtrl', ['$scope', '$modalInstance', 'Buildfire','imageInfo', function ($scope, $modalInstance, Buildfire,imageInfo) {
      var EditCarouselImagePopup = this;
      EditCarouselImagePopup.imageInfo = {
        imageUrl: imageInfo.data.imageUrl || '',
        title: imageInfo.data.title ||'',
        link: imageInfo.data.link ||'',
        target: imageInfo.data.target ||''
      };
      EditCarouselImagePopup.index = imageInfo.index;
      EditCarouselImagePopup.setTarget = function (action) {
        EditCarouselImagePopup.selectedAction = action;
      };
      EditCarouselImagePopup.ok = function (imageInfo,index) {
        if (!imageInfo.imageUrl) {
          return;
        }
        $modalInstance.close({info : imageInfo, index:index});
      };
      EditCarouselImagePopup.cancel = function () {
        $modalInstance.dismiss('You have canceled.');
      };
      var options = {showIcons: false, multiSelection: false};
      var callback = function (error, result) {
        if (error) {
          console.error('Error:', error);
        } else {
          EditCarouselImagePopup.imageInfo.imageUrl = result.selectedFiles && result.selectedFiles[0] || null;
          $scope.$digest();
        }
      };

      EditCarouselImagePopup.selectImage = function () {
        Buildfire.imageLib.showDialog(options, callback);
      };
      EditCarouselImagePopup.removeImage = function () {
        EditCarouselImagePopup.imageInfo.imageUrl = null;
      };

    }])
})(window.angular);

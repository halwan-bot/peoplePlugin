'use strict';

(function (angular) {
    angular
        .module('peoplePluginContent')
        .controller('AddCarouselImagePopupCtrl', ['$scope', '$modalInstance','Buildfire', function ($scope, $modalInstance,Buildfire) {
            var _self = this;
            _self.imageInfo = {
                imageUrl: '',
                title: '',
                deepLinkUrl: ''
            };
            _self.ok = function (imageInfo) {
                imageInfo.imageUrl = imageInfo.imageUrl ? imageInfo.imageUrl : 'http://www.placehold.it/80x50';
                $modalInstance.close(imageInfo);
            };
            _self.cancel = function () {
                $modalInstance.dismiss('You have canceled.');
            };
        var options = {showIcons: false, multiSelection: false};
        var callback = function (error, result) {
          if (error) {
            console.error('Error:', error);
          } else {
            _self.imageInfo.imageUrl = result.selectedFiles && result.selectedFiles[0] || null;
            $scope.$digest();
          }
        };

        _self.selectImage = function(){
          Buildfire.imageLib.showDialog(options, callback);
        };
        _self.removeImage = function () {
          _self.imageInfo.imageUrl = null;
        };

        }])
})(window.angular);

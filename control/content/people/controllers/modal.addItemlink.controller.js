'use strict';

(function (angular) {
    angular
        .module('peoplePluginContent')
        .controller('AddItemLinkPopupCtrl', ['$scope', '$modalInstance', 'Buildfire', function ($scope, $modalInstance,Buildfire) {
            var AddItemLinkPopup = this;
            AddItemLinkPopup.itemlink={
                iconImageUrl:'',
                title:'',
                url:''
            };
            AddItemLinkPopup.ok = function (linkInfo) {
                console.log('------------linkInfo-----------------',linkInfo);
                linkInfo.iconImageUrl=linkInfo.iconImageUrl?linkInfo.iconImageUrl:'http://www.placehold.it/80x50';
                $modalInstance.close(linkInfo);
            };
            AddItemLinkPopup.cancel = function () {
                $modalInstance.dismiss('You have canceled.');
            };
        var options = {showIcons: false, multiSelection: false};
        var callback = function (error, result) {
          if (error) {
            console.error('Error:', error);
          } else {
            console.log(result);
            AddItemLinkPopup.itemlink.iconImageUrl = result.selectedFiles && result.selectedFiles[0] || null;
            $scope.$digest();
          }
        };
            AddItemLinkPopup.selectIcon = function () {
              Buildfire.imageLib.showDialog(options, callback);
            }

        }])
})(window.angular);

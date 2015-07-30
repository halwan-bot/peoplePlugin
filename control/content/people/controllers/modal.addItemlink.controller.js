'use strict';

(function (angular) {
    angular
        .module('peoplePluginContent')
        .controller('AddItemLinkPopupCtrl', ['$scope', '$modalInstance', 'Buildfire', function ($scope, $modalInstance,Buildfire) {
            var _self = this;
            _self.itemlink={
                iconImageUrl:'',
                title:'',
                url:''
            };
            _self.ok = function (linkInfo) {
                console.log('------------linkInfo-----------------',linkInfo);
                linkInfo.iconImageUrl=linkInfo.iconImageUrl?linkInfo.iconImageUrl:'http://www.placehold.it/80x50';
                $modalInstance.close(linkInfo);
            };
            _self.cancel = function () {
                $modalInstance.dismiss('You have canceled.');
            };
        var options = {showIcons: false, multiSelection: false};
        var callback = function (error, result) {
          if (error) {
            console.error('Error:', error);
          } else {
            console.log(result);
            _self.itemlink.iconImageUrl = result.selectedFiles && result.selectedFiles[0] || null;
            $scope.$digest();
          }
        };
            _self.selectIcon = function () {
              Buildfire.imageLib.showDialog(options, callback);
            }

        }])
})(window.angular);

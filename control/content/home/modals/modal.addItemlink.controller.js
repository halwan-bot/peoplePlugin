'use strict';

(function (angular) {
    angular
        .module('peoplePluginContent')
        .controller('AddItemLinkPopupCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
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
        }])
})(window.angular);

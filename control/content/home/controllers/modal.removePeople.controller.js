'use strict';

(function (angular) {
    angular
        .module('peoplePluginContent')
        .controller('RemovePeoplePopupCtrl', ['$scope', '$modalInstance', 'peopleInfo', function ($scope, $modalInstance, peopleInfo) {
            var RemovePeoplePopup = this;
            if(peopleInfo){
                RemovePeoplePopup.peopleInfo = peopleInfo;
            }
            $scope.ok = function () {
                $modalInstance.close('yes');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('No');
            };
        }])
})(window.angular, undefined);

'use strict';

(function (angular) {
    angular
        .module('peoplePluginContent')
        .controller('RemovePeoplePopupCtrl', ['$scope', '$modalInstance', 'peopleInfo', function ($scope, $modalInstance, peopleInfo) {
            var RemovePeoplePopup = this;
            if(peopleInfo){
                RemovePeoplePopup.peopleInfo = peopleInfo;
            }
            RemovePeoplePopup.ok = function () {
                $modalInstance.close('yes');
            };
            RemovePeoplePopup.cancel = function () {
                $modalInstance.dismiss('No');
            };
        }])
})(window.angular);

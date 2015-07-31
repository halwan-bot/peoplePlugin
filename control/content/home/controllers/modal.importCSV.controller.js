'use strict';

(function (angular) {
    angular
        .module('peoplePluginContent')
        .controller('ImportCSVPopupCtrl', ['$scope', '$modalInstance','FormatConverter', function ($scope, $modalInstance,FormatConverter) {
            var ImportCSVPopup=this;
            ImportCSVPopup.ok = function (linkUrl) {
                console.log(ImportCSVPopup.fileData);
                if(ImportCSVPopup.fileData){
                    var json = FormatConverter.CSV2JSON(ImportCSVPopup.fileData);
                }
                $modalInstance.close(linkUrl);
            };
            ImportCSVPopup.cancel = function () {
                $modalInstance.dismiss('Dismiss');
            };
        }])
})(window.angular);

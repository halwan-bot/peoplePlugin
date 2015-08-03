'use strict';

(function (angular) {
    angular
        .module('peoplePluginContent')
        .controller('ImportCSVPopupCtrl', ['$scope', '$modalInstance','FormatConverter','Buildfire','TAG_NAMES', function ($scope, $modalInstance,FormatConverter,Buildfire,TAG_NAMES) {
            var ImportCSVPopup=this;
            ImportCSVPopup.ok = function (linkUrl) {
                console.log(ImportCSVPopup.fileData);
                if(ImportCSVPopup.fileData){
                    var json = FormatConverter.CSV2JSON(ImportCSVPopup.fileData);
                    Buildfire.datastore.bulkInsert(JSON.parse(angular.toJson(json)), TAG_NAMES.PEOPLE, function (err, data) {
                        if (err) {
                            console.error('There was a problem while importing the file----',err);
                        }
                        else {
                            console.log('File has been imported----------------------------',data);
                        }
                    });

                }
                $modalInstance.close(linkUrl);
            };
            ImportCSVPopup.cancel = function () {
                $modalInstance.dismiss('Dismiss');
            };
        }])
})(window.angular);

'use strict';

(function (angular, window) {
    angular
        .module('peoplePluginWidget')
        .controller('WidgetPeopleCtrl', ['$scope', '$window', 'Buildfire', 'TAG_NAMES', 'ERROR_CODE', "Location", function ($scope, $window, Buildfire, TAG_NAMES, ERROR_CODE, Location) {
            var WidgetPeople = this;
            var currentItemLayout,
                currentListLayout;
            var getContentItems = function () {
                Buildfire.datastore.get(TAG_NAMES.PEOPLE, function (err, result) {
                    if (err && err.code !== ERROR_CODE.NOT_FOUND) {
                        console.error('-----------err in getting list-------------', err);
                    }
                    else if (result) {
                        WidgetPeople.items = result.data;
                        $scope.$digest();
                    }
                });
            };
            var getContentPeopleInfo = function () {
                Buildfire.datastore.get(TAG_NAMES.PEOPLE_INFO, function (err, result) {

                    if (err && err.code !== ERROR_CODE.NOT_FOUND) {
                        console.error('-----------err-------------', err);
                    }
                    else {
                        WidgetPeople.data = result.data;
                        if (!WidgetPeople.data.content.sortBy) {
                            //WidgetPeople.data.content.sortBy = WidgetPeople.sortingOptions[0];
                        }
                        currentItemLayout = WidgetPeople.data.design.itemLayout;
                        currentListLayout = WidgetPeople.data.design.listLayout;
                        $scope.$digest();
                    }
                    getContentItems();
                });
            };
            getContentPeopleInfo();
            Buildfire.datastore.onUpdate(function (event) {
                if (event && event.tag) {
                    switch (event.tag) {
                        case TAG_NAMES.PEOPLE:
                            //update the People/Item info template in emulator
                            break;
                        case TAG_NAMES.PEOPLE_INFO:
                            if (event.obj.design.itemLayout && currentItemLayout != event.obj.design.itemLayout) {
                                WidgetPeople.data.design.itemLayout = event.obj.design.itemLayout;
                                currentItemLayout = event.obj.design.itemLayout;
                            }
                            else if (event.obj.design.listLayout && currentListLayout != event.obj.design.listLayout) {
                                Location.goToHome();
                            }
                            break;
                    }
                    $scope.$digest();
                }
            });


        }])
})(window.angular, window);

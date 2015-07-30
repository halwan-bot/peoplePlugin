'use strict';

(function (angular, window) {
    angular
        .module('peoplePluginWidget')
        .controller('WidgetHomeCtrl', ['$scope', '$window', 'Buildfire', 'TAG_NAMES', 'ERROR_CODE', "Location", function ($scope, $window, Buildfire, TAG_NAMES, ERROR_CODE, Location) {
            var WidgetHome = this;
            var currentItemLayout,
                currentListLayout;
            var getContentItems = function () {
                Buildfire.datastore.get(TAG_NAMES.PEOPLE, function (err, result) {
                    if (err && err.code !== ERROR_CODE.NOT_FOUND) {
                        console.error('-----------err in getting list-------------', err);
                    }
                    else if (result) {
                        WidgetHome.items = result.data;
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
                        WidgetHome.data = result.data;
                        if (!WidgetHome.data.content.sortBy) {
                            //WidgetHome.data.content.sortBy = WidgetHome.sortingOptions[0];
                        }
                        currentItemLayout = WidgetHome.data.design.itemLayout;
                        currentListLayout = WidgetHome.data.design.listLayout;
                        $scope.$digest();
                    }
                    getContentItems();
                });
            };
            getContentPeopleInfo();

            Buildfire.datastore.onUpdate(function (event) {
                if (event && event.tag) {
                  WidgetHome.data = event.obj;
                    switch (event.tag) {
                        case TAG_NAMES.PEOPLE:
                            //update the People/Item info template in emulator
                            break;
                        case TAG_NAMES.PEOPLE_INFO:
                            if (event.obj.design.itemLayout && currentItemLayout != event.obj.design.itemLayout) {
                                Location.goTo("#/people");
                            }
                            else if (event.obj.design.listLayout && currentListLayout != event.obj.design.listLayout) {

                                currentListLayout = event.obj.design.listLayout
                            }
                            break;
                    }
                    $scope.$digest();
                }
            });


        }])
})(window.angular, window);

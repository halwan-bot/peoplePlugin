'use strict';

(function (angular, window) {
    angular
        .module('peoplePluginWidget')
        .controller('WidgetPeopleCtrl', ['$scope', 'Buildfire', 'TAG_NAMES', 'ERROR_CODE', "Location", '$routeParams', '$sce', '$location', '$rootScope',
            function ($scope, Buildfire, TAG_NAMES, ERROR_CODE, Location, $routeParams, $sce, $location, $rootScope) {
                var WidgetPeople = this;
                var currentItemLayout,
                    currentListLayout;
                var DEFAULT_LIST_LAYOUT = 'list-layout-1',
                    DEFAULT_ITEM_LAYOUT = 'item-layout-1';
                WidgetPeople.defaults = {
                    DEFAULT_LIST_LAYOUT: 'list-layout-1',
                    DEFAULT_ITEM_LAYOUT: 'item-layout-1',
                    DEFAULT_SORT_OPTION: "Oldest to Newest"
                };
                var breadCrumbFlag = true;

                buildfire.history.get('pluginBreadcrumbsOnly', function (err, result) {
                    if(result && result.length) {
                        result.forEach(function(breadCrumb) {
                            if(breadCrumb.label == 'Person') {
                                breadCrumbFlag = false;
                            }
                        });
                    }
                    if(breadCrumbFlag) {
                        buildfire.history.push('Person', { elementToShow: 'Person' });
                    }
                });

                /*
                 Send message to Control that this page has been opened
                 */
                var _searchObj = $location.search();
                if ($routeParams.id && !_searchObj.stopSwitch) {
                    $routeParams.showHome = false;
                    console.log($location.search());
                    buildfire.messaging.sendMessageToControl({id: $routeParams.id, type: 'OpenItem'});
                }
                $rootScope.showHome = false;
                /*declare the device width heights*/
                WidgetPeople.deviceHeight = window.innerHeight;
                WidgetPeople.deviceWidth = window.innerWidth;

                /*initialize the device width heights*/
                var initDeviceSize = function (callback) {
                    WidgetPeople.deviceHeight = window.innerHeight;
                    WidgetPeople.deviceWidth = window.innerWidth;
                    if (callback) {
                        if (WidgetPeople.deviceWidth == 0 || WidgetPeople.deviceHeight == 0) {
                            setTimeout(function () {
                                initDeviceSize(callback);
                            }, 500);
                        } else {
                            callback();
                            if (!$scope.$$phase && !$scope.$root.$$phase) {
                                $scope.$apply();
                            }
                        }
                    }
                };

                /*crop image on the basis of width heights*/
                WidgetPeople.cropImage = function (url, settings) {
                    var options = {};
                    if (!url) {
                        return "";
                    }
                    else {
                        if (settings.height) {
                            options.height = settings.height;
                        }
                        if (settings.width) {
                            options.width = settings.width;
                        }
                        return Buildfire.imageLib.cropImage(url, options);
                    }
                };

                WidgetPeople.safeHtml = function (html) {
                    if (html)
                        return $sce.trustAsHtml(html);
                };
                var itemId = $routeParams.id;
                var getPeopleDetail = function () {
                    Buildfire.datastore.getById(itemId, TAG_NAMES.PEOPLE, function (err, result) {
                        if (err && err.code !== ERROR_CODE.NOT_FOUND) {
                            $rootScope.showHome = false;
                            console.error('-----------Unable to load data-------------', err);
                        }
                        else {
                            $rootScope.showHome = false;
                            WidgetPeople.item = result.data;
                            $scope.$digest();
                        }
                        bindOnUpdate();
                    });
                };
                var getContentPeopleInfo = function () {
                    Buildfire.datastore.get(TAG_NAMES.PEOPLE_INFO, function (err, result) {

                        if (err && err.code !== ERROR_CODE.NOT_FOUND) {
                            return console.error('-----------err-------------', err);
                        }
                        if (result && result.data) {
                            WidgetPeople.data = result.data;
                            if (!WidgetPeople.data.content) {
                                WidgetPeople.data.content = {
                                    sortBy: WidgetPeople.defaults.DEFAULT_SORT_OPTION
                                }
                            }
                            if (!WidgetPeople.data.design) {
                                WidgetPeople.data.design = {
                                    itemLayout: WidgetPeople.defaults.DEFAULT_ITEM_LAYOUT,
                                    listLayout: WidgetPeople.defaults.DEFAULT_LIST_LAYOUT
                                };
                            } else {
                                currentItemLayout = WidgetPeople.data.design.itemLayout;
                                currentListLayout = WidgetPeople.data.design.listLayout;
                            }
                            $scope.$digest();
                        } else {
                            throw ("Error with people plugin.");
                        }

                        getPeopleDetail();
                    });
                };
                getContentPeopleInfo();
                function bindOnUpdate() {
                    WidgetPeople.onUpdateFn = Buildfire.datastore.onUpdate(function (event) {
                        console.log("Hello--------1")
                        if (event && event.tag) {
                            switch (event.tag) {
                                case TAG_NAMES.PEOPLE:
                                    console.log('People iNfo updated-----------------', event.data);
                                    $rootScope.$broadcast('Item_Updated', event);
                                    if (event.data)
                                        WidgetPeople.item = event.data;
                                    break;
                                case TAG_NAMES.PEOPLE_INFO:
                                    WidgetPeople.data = event.data;
                                    if (event.data.design.backgroundImage) {
                                        $rootScope.backgroundImage = event.data.design.backgroundImage;
                                    }
                                    else {
                                        $rootScope.backgroundImage = ""
                                    }
                                    if (event.data.design.itemLayout && currentItemLayout != event.data.design.itemLayout) {
                                        WidgetPeople.data.design.itemLayout = event.data.design.itemLayout;
                                        currentItemLayout = event.data.design.itemLayout;

                                    }
                                    else if (event.data.design.listLayout && currentListLayout != event.data.design.listLayout) {
                                        Location.goToHome();
                                    }
                                    break;
                            }
                            $scope.$digest();
                        }
                    });
                }

                $scope.$on("$destroy", function () {
                    WidgetPeople.onUpdateFn.clear();

                    $rootScope.$broadcast('ROUTE_CHANGED', WidgetPeople.data.design.listLayout, WidgetPeople.data.design.itemLayout, WidgetPeople.data.design.backgroundImage, WidgetPeople.data);
                });
                WidgetPeople.openLinks = function (actionItems) {
                    if (actionItems && actionItems.length) {
                        var options = {};
                        var callback = function (error, result) {
                            if (error) {
                                console.error('Error:', error);
                            }
                        };
                        buildfire.actionItems.list(actionItems, options, callback);
                    }
                }
                Buildfire.datastore.onRefresh(function(){

                    getPeopleDetail();
                  });
            }])
})(window.angular, window);

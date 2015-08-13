'use strict';

(function (angular, window) {
    angular
        .module('peoplePluginWidget')
        .controller('WidgetHomeCtrl', ['$scope', '$window', 'Buildfire', 'TAG_NAMES', 'ERROR_CODE', "Location", '$sce', function ($scope, $window, Buildfire, TAG_NAMES, ERROR_CODE, Location, $sce) {
            var MANUALLY = 'Manually',
                OLDEST_TO_NEWEST = 'Oldest to Newest',
                NEWEST_TO_OLDEST = 'Newest to Oldest',
                FIRST_NAME_A_TO_Z = 'First Name A-Z',
                FIRST_NAME_Z_TO_A = 'First Name Z-A',
                LAST_NAME_A_TO_Z = 'Last Name A-Z',
                LAST_NAME_Z_TO_A = 'Last Name Z-A',
                _pageSize = 10,
                searchOptions = {
                    filter: {"$json.fName": {"$regex": '/*'}},
                    page: 0,
                    pageSize: _pageSize + 1 // the plus one is to check if there are any more
                },
                DEFAULT_LIST_LAYOUT = 'list-layout-1',
                DEFAULT_ITEM_LAYOUT = 'item-layout-1';

            var WidgetHome = this;
            WidgetHome.data = {};
            WidgetHome.busy = false;
            WidgetHome.sortingOptions = [
                MANUALLY,
                OLDEST_TO_NEWEST,
                NEWEST_TO_OLDEST,
                FIRST_NAME_A_TO_Z,
                FIRST_NAME_Z_TO_A,
                LAST_NAME_A_TO_Z,
                LAST_NAME_Z_TO_A
            ];
            WidgetHome.defaults = {
                DEFAULT_LIST_LAYOUT: 'list-layout-1',
                DEFAULT_ITEM_LAYOUT: 'item-layout-1',
                DEFAULT_SORT_OPTION: WidgetHome.sortingOptions[0]
            }
            var currentItemLayout,
                currentListLayout, currentSortOrder, currentBackgroundImage;

            buildfire.messaging.onReceivedMessage = function (msg) {
                if (msg.path)
                    Location.goTo('#/');
                else
                    Location.goTo("#/people/" + msg.id);
            };

            var getContentPeopleInfo = function () {
                Buildfire.datastore.get(TAG_NAMES.PEOPLE_INFO, function (err, result) {
                    if (err && err.code !== ERROR_CODE.NOT_FOUND) {
                        return console.error('-----------err-------------', err);
                    }
                    if (result && result.data) {
                        WidgetHome.data = result.data;
                        if (!WidgetHome.data.content) {
                            WidgetHome.data.content = {
                                sortBy: WidgetHome.defaults.DEFAULT_SORT_OPTION
                            }
                        }
                        if (!WidgetHome.data.design) {
                            WidgetHome.data.design = {
                                itemLayout: WidgetHome.defaults.DEFAULT_ITEM_LAYOUT,
                                listLayout: WidgetHome.defaults.DEFAULT_LIST_LAYOUT
                            }
                            currentItemLayout = WidgetHome.data.design.itemLayout;
                            currentListLayout = WidgetHome.data.design.listLayout;
                        }
                        if (WidgetHome.data.content && WidgetHome.data.content.description)
                            WidgetHome.data.content.description = $sce.trustAsHtml(WidgetHome.data.content.description);
                        currentSortOrder = WidgetHome.data.content.sortBy;
                        currentBackgroundImage = WidgetHome.data.design.backgroundImage;
                        if (currentBackgroundImage)
                            $('body').css('background', '#010101 url(' + Buildfire.imageLib.resizeImage(currentBackgroundImage, {
                                width: 342,
                                height: 770
                            }) + ') repeat fixed top center');
                        $scope.$digest();
                    }
                    else {
                        throw ("Error with people plugin.")
                    }
                });
            };
            var getSearchOptions = function (value) {
                switch (value) {
                    case OLDEST_TO_NEWEST:
                        searchOptions.sort = {"dateCreated": 1};
                        break;
                    case NEWEST_TO_OLDEST:
                        searchOptions.sort = {"dateCreated": -1};
                        break;
                    case FIRST_NAME_A_TO_Z:
                        searchOptions.sort = {"fName": 1};
                        break;
                    case FIRST_NAME_Z_TO_A:
                        searchOptions.sort = {"fName": -1};
                        break;
                    case LAST_NAME_A_TO_Z:
                        searchOptions.sort = {"lName": 1};
                        break;
                    case LAST_NAME_Z_TO_A:
                        searchOptions.sort = {"lName": -1};
                        break;
                    default :
                        searchOptions.sort = {"rank": 1};
                        break;
                }
                return searchOptions;
            };
            getContentPeopleInfo();

            $scope.isDefined = function (item) {
                return item.imageUrl !== undefined && item.imageUrl !== '';
            };
            WidgetHome.safeHtml = function (html) {
                if (html)
                    return $sce.trustAsHtml(html);
            }
            WidgetHome.onUpdateFn = Buildfire.datastore.onUpdate(function (event) {
                $scope.imagesUpdated = false;
                $scope.$digest();
                if (event && event.tag) {
                    if (!WidgetHome.data.content) {
                        WidgetHome.data.content = {
                            sortBy: WidgetHome.defaults.DEFAULT_SORT_OPTION
                        }
                    }
                    if (!WidgetHome.data.design) {
                        WidgetHome.data.design = {
                            itemLayout: WidgetHome.defaults.DEFAULT_ITEM_LAYOUT,
                            listLayout: WidgetHome.defaults.DEFAULT_LIST_LAYOUT
                        }
                        currentItemLayout = WidgetHome.data.design.itemLayout;
                        currentListLayout = WidgetHome.data.design.listLayout;
                    }
                    switch (event.tag) {
                        case TAG_NAMES.PEOPLE:
                            var currentPage = searchOptions.page;
                            if (searchOptions.page) {
                                searchOptions.pageSize = searchOptions.pageSize * (searchOptions.page + 1);
                                searchOptions.page = 0;
                            }
                            WidgetHome.busy = false;
                            WidgetHome.items = [];
                            WidgetHome.loadMore(function () {
                                searchOptions.page = currentPage;
                                searchOptions.pageSize = _pageSize + 1;
                            });
                            break;
                        case TAG_NAMES.PEOPLE_INFO:
                            if (event.obj) {
                                if (event.obj.design && event.obj.design.itemLayout && currentItemLayout != event.obj.design.itemLayout) {
                                    if (WidgetHome.items && WidgetHome.items.length) {
                                        var id = WidgetHome.items[0].id;
                                        Location.goTo("#/people/" + id);
                                    }
                                }
                                else if (event.obj.design && event.obj.design.listLayout && currentListLayout != event.obj.design.listLayout) {
                                    currentListLayout = event.obj.design.listLayout;
                                    WidgetHome.data.design.listLayout = event.obj.design.listLayout;
                                }

                                if (!WidgetHome.data.design)
                                    WidgetHome.data.design = {};
                                currentItemLayout = WidgetHome.data.design.itemLayout || DEFAULT_ITEM_LAYOUT;
                                /**
                                 * condition added to update the background image
                                 */
                                if (event.obj.design && event.obj.design.backgroundImage && currentBackgroundImage != event.obj.design.backgroundImage) {
                                    currentBackgroundImage = event.obj.design.backgroundImage;
                                    $('body').css('background', '#010101 url(' + Buildfire.imageLib.resizeImage(currentBackgroundImage, {
                                        width: 342,
                                        height: 770
                                    }) + ') repeat fixed top center');
                                }
                                else if (event.obj.design && !event.obj.design.backgroundImage) {
                                    currentBackgroundImage = null;
                                    $('body').css('background', 'none');
                                }

                                if (event.obj.content) {
                                    if (!WidgetHome.data)
                                        WidgetHome.data = {};
                                    WidgetHome.data.content = event.obj.content;
                                    $scope.imagesUpdated = true;
                                } else {
                                    $scope.imagesUpdated = false;
                                }
                                if (WidgetHome.data.content && WidgetHome.data.content.description)
                                    WidgetHome.data.content.description = $sce.trustAsHtml(WidgetHome.data.content.description);

                                if (event.obj.content.sortBy && currentSortOrder != event.obj.content.sortBy) {
                                    WidgetHome.data.content.sortBy = event.obj.content.sortBy;
                                    WidgetHome.items = [];
                                    searchOptions.page = 0;
                                    WidgetHome.busy = false;
                                    WidgetHome.loadMore();
                                }
                            }
                            break;
                    }
                    $scope.$digest();
                }
            });
            WidgetHome.loadMore = function (cb) {
                if (WidgetHome.busy) {
                    return;
                }
                WidgetHome.busy = true;
                if (WidgetHome.data && WidgetHome.data.content.sortBy) {
                    searchOptions = getSearchOptions(WidgetHome.data.content.sortBy);
                }

                Buildfire.datastore.search(searchOptions, TAG_NAMES.PEOPLE, function (err, result) {
                    if (err) {
                        return console.error('-----------err in getting list-------------', err);
                    }
                    else {
                        console.info('Widget ----------------------------------- load More data------------called');
                        if (result.length > _pageSize) {// to indicate there are more
                            result.pop();
                            searchOptions.page = searchOptions.page + 1;
                            WidgetHome.busy = false;
                        }
                        WidgetHome.items = WidgetHome.items ? WidgetHome.items.concat(result) : result;
                        cb && cb();
                        $scope.$digest();
                    }
                });
            };
            /**
             * WidgetHome.resizeImage method to resize
             * @param url
             * @param width
             * @param height
             * @returns {null}
             */
            WidgetHome.resizeImage = function (url, width, height) {
                return Buildfire.imageLib.resizeImage(url, {width: width, height: height});
            };

            $scope.$on("$destroy", function () {
                WidgetHome.onUpdateFn.clear();
            });
        }])
        // Directive for adding  Image carousel on widget home page
        .directive('imageCarousel', function () {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    scope.carousel = null;
                    scope.isCarouselInitiated = false;
                    function initCarousel() {
                        scope.carousel = null;
                        setTimeout(function () {
                            var obj = {
                                'items': 1,
                                'slideSpeed': 300,
                                'dots': true,
                                'autoplay': true
                            };

                            var totalImages = parseInt(attrs.imageCarousel, 10);
                            if (totalImages) {
                                if (totalImages > 1) {
                                    obj['loop'] = true;
                                }
                                scope.carousel = $(elem).owlCarousel(obj);
                                scope.isCarouselInitiated = true;
                            }
                            scope.$apply();
                        }, 100);
                    }

                    initCarousel();

                    scope.$watch("imagesUpdated", function (newVal, oldVal) {
                        if (newVal) {
                            if (scope.isCarouselInitiated) {
                                scope.carousel.trigger("destroy.owl.carousel");
                                scope.isCarouselInitiated = false;
                            }
                            $(elem).find(".owl-stage-outer").remove();
                            initCarousel();
                        }
                    });
                }
            }
        })
})(window.angular, window);

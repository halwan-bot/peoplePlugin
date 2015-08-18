'use strict';

(function (angular, window) {
    angular
        .module('peoplePluginContent')
        .controller('ContentHomeCtrl', ['$scope', '$window', '$modal', 'Buildfire', '$csv', 'TAG_NAMES', 'ERROR_CODE', 'RankOfLastItem', '$timeout', 'Location', '$sce', 'PeopleInfo',
            function ($scope, $window, $modal, Buildfire, FormatConverter, TAG_NAMES, ERROR_CODE, RankOfLastItem, $timeout, Location, $sce, PeopleInfo) {
                /**
                 * List of options available for sorting people list.
                 * */
                var header = {
                    topImage: "Image URL",
                    fName: "First Name",
                    lName: "Last Name",
                    position: "Position",
                    deepLinkUrl: "Deeplink Url",
                    bodyContent: "Information"
                };
                var MANUALLY = 'Manually',
                    OLDEST_TO_NEWEST = 'Oldest to Newest',
                    NEWEST_TO_OLDEST = 'Newest to Oldest',
                    FIRST_NAME_A_TO_Z = 'First Name A-Z',
                    FIRST_NAME_Z_TO_A = 'First Name Z-A',
                    LAST_NAME_A_TO_Z = 'Last Name A-Z',
                    LAST_NAME_Z_TO_A = 'Last Name Z-A',

                    /**
                     * _limit used to specify number of records per page.
                     * _skip used to specify nextPageToken.
                     * @type {number}
                     * @private
                     */
                    _limit = 10,
                    _maxLimit = 19,
                    _skip = 0,

                    /**
                     * SearchOptions are using for searching , sorting people and fetching people list
                     * @type object
                     */
                    searchOptions = {
                        filter: {"$json.fName": {"$regex": '/*'}}, skip: _skip, limit: _limit + 1 // the plus one is to check if there are any more
                    };

                function isValidItem(item, index, array) {
                    return item.fName || item.lName;
                }

                function validateCsv(items) {
                    if (!Array.isArray(items) || !items.length) {
                        return false;
                    }
                    return items.every(isValidItem);
                }

                // Handler to receive message from widget

                buildfire.messaging.onReceivedMessage = function (msg) {
                    Location.goTo("#/people/" + msg.id);
                };

                var ContentHome = this;

                /**
                 * ContentHome.busy used to enable/disable infiniteScroll. if busy true it means there is not more data.
                 * @type {boolean}
                 */
                ContentHome.busy = false;


                /**
                 * ContentHome.items used to store the people list which fetched from server.
                 * @type {null}
                 */
                ContentHome.items = null;

                /**
                 * ContentHome.data used to store PeopleInfo which fetched from server.
                 * @type {null}
                 */
                ContentHome.data = null;

                /**
                 * ContentHome.sortingOptions are used to show options in Sort Items drop-down menu in home.html.
                 * @type {*[]}
                 */
                ContentHome.sortingOptions = [
                    MANUALLY,
                    OLDEST_TO_NEWEST,
                    NEWEST_TO_OLDEST,
                    FIRST_NAME_A_TO_Z,
                    FIRST_NAME_Z_TO_A,
                    LAST_NAME_A_TO_Z,
                    LAST_NAME_Z_TO_A
                ];
                ContentHome.safeHtml = function (html) {
                    if (html)
                        return $sce.trustAsHtml(html);
                }

                ContentHome.descriptionWYSIWYGOptions = {
                    plugins: 'advlist autolink link image lists charmap print preview',
                    skin: 'lightgray',
                    trusted: true,
                    theme: 'modern'
                };
                ContentHome.data = PeopleInfo.data;

                RankOfLastItem.setRank(ContentHome.data.content.rankOfLastItem || 0);
                /**
                 * ContentHome.imageSortableOptions used for ui-sortable directory to drag-drop carousel images Manually.
                 * @type object
                 */
                ContentHome.imageSortableOptions = {
                    handle: '> .cursor-grab'
                };

                /**
                 * ContentHome.itemSortableOptions used for ui-sortable directory to sort people listing Manually.
                 * @type object
                 */
                ContentHome.itemSortableOptions = {
                    handle: '> .cursor-grab',
                    disabled: true,
                    stop: function (e, ui) {
                        var endIndex = ui.item.sortable.dropindex,
                            maxRank = 0,
                            draggedItem = ContentHome.items[endIndex];

                        if (draggedItem) {
                            var prev = ContentHome.items[endIndex - 1],
                                next = ContentHome.items[endIndex + 1];
                            var isRankChanged = false;
                            if (next) {
                                if (prev) {
                                    draggedItem.data.rank = ((prev.data.rank || 0) + (next.data.rank || 0)) / 2;
                                    isRankChanged = true;
                                } else {
                                    draggedItem.data.rank = (next.data.rank || 0) / 2;
                                    isRankChanged = true;
                                }
                            } else {
                                if (prev) {
                                    draggedItem.data.rank = (((prev.data.rank || 0) * 2) + 10) / 2;
                                    maxRank = draggedItem.data.rank;
                                    isRankChanged = true;
                                }
                            }
                            if (isRankChanged) {
                                Buildfire.datastore.update(draggedItem.id, draggedItem.data, TAG_NAMES.PEOPLE, function (err) {
                                    if (err) {
                                        console.error('Error during updating rank');
                                    } else {
                                        if (ContentHome.data.content.rankOfLastItem < maxRank) {
                                            ContentHome.data.content.rankOfLastItem = maxRank;
                                            RankOfLastItem.setRank(maxRank);
                                        }
                                    }
                                })
                            }
                        }
                    }
                };
                ContentHome.itemSortableOptions.disabled = !(ContentHome.data.content.sortBy === MANUALLY);

                ContentHome.DeepLinkCopyUrl = false;

                /**
                 * tmrDelayForPeopleInfo is used to update peopleInfo after given time in setTimeOut.
                 * @type {null}
                 */
                var tmrDelayForPeopleInfo = null;

                // Send message to widget to return to list layout
                buildfire.messaging.sendMessageToWidget({path: "/"});

                /**
                 * saveData(newObj, tag) used to save a new record in datastore.
                 * @param newObj is a new/modified object.
                 * @param tag is a tag name or identity given to the data json during saving the record.
                 */
                var saveData = function (newObj, tag) {
                    if (newObj == undefined)
                        return;
                    newObj.content.rankOfLastItem = newObj.content.rankOfLastItem || 0;
                    Buildfire.datastore.save(newObj, tag, function (err, result) {
                        if (err || !result) {
                            console.error('------------error saveData-------', err);
                        }
                        else {
                            RankOfLastItem.setRank(result.obj.content.rankOfLastItem);
                        }
                    });
                };

                /**
                 * getSearchOptions(value) is used to get searchOptions with one more key sort which decide the order of sorting.
                 * @param value is used to filter sort option.
                 * @returns object
                 */
                var getSearchOptions = function (value) {
                    ContentHome.itemSortableOptions.disabled = true;
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
                            ContentHome.itemSortableOptions.disabled = false;
                            searchOptions.sort = {"rank": 1};
                            break;
                    }
                    return searchOptions;
                };

                /**
                 * ContentHome.loadMore() called by infiniteScroll to implement lazy loading
                 */
                ContentHome.noMore = false;
                ContentHome.loadMore = function (search) {
                    if (ContentHome.busy) {
                        return;
                    }
                    ContentHome.busy = true;
                    if (ContentHome.data && ContentHome.data.content.sortBy && !search) {
                        searchOptions = getSearchOptions(ContentHome.data.content.sortBy);
                    }
                    Buildfire.datastore.search(searchOptions, TAG_NAMES.PEOPLE, function (err, result) {
                        if (err) {
                            return console.error('-----------err in getting list-------------', err);
                        }
                        if (result.length <= _limit) {// to indicate there are more
                            ContentHome.noMore = true;
                        } else {
                            result.pop();
                            searchOptions.skip = searchOptions.skip + _limit + 1;
                            ContentHome.noMore = false;
                        }
                        ContentHome.items = ContentHome.items ? ContentHome.items.concat(result) : result;
                        ContentHome.busy = false;
                        $scope.$digest();
                    });
                };
                /**
                 * Used to show/hide alert message when item's deep-link copied from people list.
                 */
                ContentHome.openDeepLinkDialog = function () {
                    ContentHome.DeepLinkCopyUrl = true;
                    setTimeout(function () {
                        ContentHome.DeepLinkCopyUrl = false;
                        $scope.$apply();
                    }, 1500);
                };

                /**
                 * method to open the importCSV Dialog
                 */
                ContentHome.openImportCSVDialog = function () {
                    var modalInstance = $modal
                        .open({
                            templateUrl: 'templates/modals/import-csv.html',
                            controller: 'ImportCSVPopupCtrl',
                            controllerAs: 'ImportCSVPopup',
                            size: 'sm'
                        });
                    modalInstance.result.then(function (rows) {
                        ContentHome.loading = true;
                        if (rows && rows.length) {
                            var rank = ContentHome.data.content.rankOfLastItem || 0;
                            for (var index = 0; index < rows.length; index++) {
                                rank += 10;
                                rows[index].dateCreated = +new Date();
                                rows[index].socialLinks = [];
                                rows[index].rank = rank;
                            }
                            if (validateCsv(rows)) {
                                Buildfire.datastore.bulkInsert(rows, TAG_NAMES.PEOPLE, function (err, data) {
                                    ContentHome.loading = false;
                                    $scope.$apply();
                                    if (err) {
                                        console.error('There was a problem while importing the file----', err);
                                    }
                                    else {
                                        console.info('File has been imported----------------------------');
                                        ContentHome.busy = false;
                                        ContentHome.items = null;
                                        ContentHome.loadMore();
                                        ContentHome.data.content.rankOfLastItem = rank;
                                    }
                                });
                            } else {
                                ContentHome.loading = false;
                                $scope.$apply();
                                ContentHome.csvDataInvalid = true;
                                $timeout(function hideCsvDataError() {
                                    ContentHome.csvDataInvalid = false;
                                }, 2000)
                            }
                        }
                        else {
                            ContentHome.loading = false;
                            $scope.$apply();
                        }
                    }, function (error) {
                        ContentHome.loading = false;
                        $scope.apply();
                        //do something on cancel
                    });
                };

                /**
                 * ContentHome.exportCSV() used to export people list data to CSV
                 */
                ContentHome.exportCSV = function () {
                    getRecords({
                            filter: {"$json.fName": {"$regex": '/*'}},
                            skip: 0,
                            limit: _maxLimit + 1 // the plus one is to check if there are any more
                        },
                        []
                        , function (err, data) {
                            if (err) {
                                return console.error('Err while exporting data--------------------------------', err);
                            }
                            if (data && data.length) {
                                var persons = [];
                                angular.forEach(angular.copy(data), function (value) {
                                    delete value.data.dateCreated;
                                    delete value.data.iconImage;
                                    delete value.data.socialLinks;
                                    delete value.data.rank;
                                    persons.push(value.data);
                                });
                                var csv = FormatConverter.jsonToCsv(angular.toJson(persons), {
                                    header: header
                                });
                                FormatConverter.download(csv, "Export.csv");
                            }
                            else {
                                ContentHome.getTemplate();
                            }
                            records = [];
                        });
                };
                /**
                 * records holds the data to export the data.
                 * @type {Array}
                 */
                var records = [];

                /**
                 * getRecords function get the  all items from DB
                 * @param searchOption
                 * @param callback
                 */
                function getRecords(searchOption, records, callback) {
                    console.log("Data length", records.length);
                    Buildfire.datastore.search(searchOption, TAG_NAMES.PEOPLE, function (err, result) {
                        if (err) {
                            console.error('-----------err in getting list-------------', err);
                            return callback(err, []);
                        }
                        if (result.length <= _maxLimit) {// to indicate there are more
                            records = records.concat(result);
                            return callback(null, records);
                        }
                        else {
                            result.pop();
                            searchOption.skip = searchOption.skip + _maxLimit + 1;
                            records = records.concat(result)
                            return getRecords(searchOption, records, callback);
                        }
                    });
                }

                /**
                 * ContentHome.getTemplate() used to download csv template
                 */
                ContentHome.getTemplate = function () {
                    var templateData = [{
                        topImage: "",
                        fName: "",
                        lName: "",
                        position: "",
                        deepLinkUrl: "",
                        bodyContent: ""
                    }];
                    var csv = FormatConverter.jsonToCsv(angular.toJson(templateData), {
                        header: header
                    });
                    FormatConverter.download(csv, "Template.csv");
                };

                /**
                 * ContentHome.removeListItem() used to delete an item from people list
                 * @param _index tells the index of item to be deleted.
                 */
                ContentHome.removeListItem = function (_index) {
                    var modalInstance = $modal.open({
                        templateUrl: 'templates/modals/remove-people.html',
                        controller: 'RemovePeoplePopupCtrl',
                        controllerAs: 'RemovePeoplePopup',
                        size: 'sm',
                        resolve: {
                            peopleInfo: function () {
                                return ContentHome.items[_index];
                            }
                        }
                    });
                    modalInstance.result.then(function (message) {
                        if (message === 'yes') {
                            var item = ContentHome.items[_index];
                            Buildfire.datastore.delete(item.id, TAG_NAMES.PEOPLE, function (err, result) {
                                if (err)
                                    return;
                                ContentHome.items.splice(_index, 1);
                                $scope.$digest();
                            });
                        }
                    }, function (data) {
                        //do something on cancel
                    });
                };

                /**
                 * ContentHome.searchListItem() used to search people list
                 * @param value to be search.
                 */
                ContentHome.searchListItem = function (value) {
                    var fullName = '';
                    searchOptions.skip = 0;
                    ContentHome.busy = false;
                    ContentHome.items = null;
                    value = value.trim();
                    if (value) {
                        if (value.indexOf(' ') !== -1) {
                            fullName = value.split(' ');
                            searchOptions.filter = {"$and": [{"$json.fName": {"$regex": fullName[0]}}, {"$json.lName": {"$regex": fullName[1]}}]};
                        } else {
                            fullName = value;
                            searchOptions.filter = {"$or": [{"$json.fName": {"$regex": fullName}}, {"$json.lName": {"$regex": fullName}}]};
                        }
                    } else {
                        searchOptions.filter = {"$json.fName": {"$regex": '/*'}};
                    }
                    ContentHome.loadMore('search');
                };

                /**
                 * ContentHome.sortPeopleBy(value) used to sort people list
                 * @param value is a sorting option
                 */
                ContentHome.sortPeopleBy = function (value) {
                    if (!value) {
                        console.info('There was a problem sorting your data');
                    } else {
                        ContentHome.items = null;
                        searchOptions.skip = 0;
                        ContentHome.busy = false;
                        ContentHome.data.content.sortBy = value;
                        ContentHome.loadMore();
                    }
                };

                /**
                 *  ContentHome.openAddCarouselImagePopup() used to add carousel images
                 */
                ContentHome.openAddCarouselImagePopup = function () {
                    var modalInstance = $modal
                        .open({
                            templateUrl: 'templates/modals/add-carousel-image.html',
                            controller: 'AddCarouselImagePopupCtrl',
                            controllerAs: 'AddCarouselImagePopup',
                            size: 'sm'
                        });
                    modalInstance.result.then(function (imageInfo) {
                        if (imageInfo && ContentHome.data) {
                            if (!ContentHome.data.content.images)
                                ContentHome.data.content.images = [];
                            ContentHome.data.content.images.push(JSON.parse(angular.toJson(imageInfo)));
                        } else {
                            console.info('Unable to load data.')
                        }
                    }, function (err) {
                        //do something on cancel
                    });
                };

                /**
                 * ContentHome.openAddImageLinkPopup(_index) used to add link to carousel image
                 * @param _index is the index of carousel image to be linked.
                 */
                ContentHome.openAddImageLinkPopup = function (_index) {
                    var modalInstance = $modal
                        .open({
                            templateUrl: 'templates/modals/add-image-link.html',
                            controller: 'AddImageLinkPopupCtrl',
                            controllerAs: 'AddImageLinkPopup',
                            size: 'sm'
                        });
                    modalInstance.result.then(function (_link) {
                        if (_link && ContentHome.data) {
                            ContentHome.data.content.images[_index].link = _link;
                        } else {
                            console.info('Unable to load data.')
                        }
                    }, function (err) {
                        //do something on cancel
                    });
                };

                /**
                 * ContentHome.openAddImageLinkPopup($index) used to remove a carousel image
                 * @param $index is the index of carousel image to be remove.
                 */
                ContentHome.removeCarouselImage = function ($index) {
                    var modalInstance = $modal
                        .open({
                            templateUrl: 'templates/modals/remove-image-link.html',
                            controller: 'RemoveImagePopupCtrl',
                            controllerAs: 'RemoveImagePopup',
                            size: 'sm',
                            resolve: {
                                imageInfo: function () {
                                    return ContentHome.data.content.images[$index]
                                }
                            }
                        });
                    modalInstance.result.then(function (data) {
                        if (data)
                            ContentHome.data.content.images.splice($index, 1);
                    }, function (data) {
                        //do something on cancel
                    });
                };

                /**
                 * saveDataWithDelay(infoData) called when PEOPLE_INFO data get changed
                 * @param infoData is the modified object returned by $scope.$watch.
                 */
                var saveDataWithDelay = function (infoData) {
                    if (infoData) {
                        if (tmrDelayForPeopleInfo) {
                            clearTimeout(tmrDelayForPeopleInfo);
                        }
                        tmrDelayForPeopleInfo = setTimeout(function () {
                            saveData(JSON.parse(angular.toJson(infoData)), TAG_NAMES.PEOPLE_INFO);
                        }, 500);
                    }
                };

                /**
                 * $scope.$watch used to determine that ContentHome.data has changed.
                 */
                $scope.$watch(function () {
                    return ContentHome.data;
                }, saveDataWithDelay, true);

            }])
})(window.angular, window);

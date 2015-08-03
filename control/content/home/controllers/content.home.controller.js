'use strict';

(function (angular, window) {
    angular
        .module('peoplePluginContent')
        .controller('ContentHomeCtrl', ['$scope', '$window', '$modal', 'Buildfire', 'FormatConverter', 'TAG_NAMES', 'ERROR_CODE', function ($scope, $window, $modal, Buildfire, FormatConverter, TAG_NAMES, ERROR_CODE) {
            var MANUALLY = 'Manually',
                OLDEST_TO_NEWEST = 'Oldest to Newest',
                NEWEST_TO_OLDEST = 'Newest to Oldest',
                FIRST_NAME_A_TO_Z = 'First Name A-Z',
                FIRST_NAME_Z_TO_A = 'First Name Z-A',
                LAST_NAME_A_TO_Z = 'Last Name A-Z',
                LAST_NAME_Z_TO_A = 'Last Name Z-A',
                _pageSize = 20,
                _page = 0,
                searchOptions = {
                    filter: {"$json.fName": {"$regex": '/*'}}, page: _page, pageSize: _pageSize + 1 // the plus one is to check if there are any more
                };

            var ContentHome = this;
            ContentHome.items = null;
            ContentHome.data = null;
            ContentHome.sortingOptions = [
                MANUALLY,
                OLDEST_TO_NEWEST,
                NEWEST_TO_OLDEST,
                FIRST_NAME_A_TO_Z,
                FIRST_NAME_Z_TO_A,
                LAST_NAME_A_TO_Z,
                LAST_NAME_Z_TO_A
            ];
            ContentHome.imageSortableOptions = {
                handle: '> .cursor-grab'
            };
            ContentHome.itemSortableOptions = {
                handle: '> .cursor-grab',
                stop: function (e, ui) {
                    ContentHome.data.content.sortBy = ContentHome.sortingOptions[0];
                }
            };
            ContentHome.DeepLinkCopyUrl = false;
            var tmrDelayForPeopleInfo = null;
            var _data = {
                content: {
                    images: [],
                    description: '',
                    sortBy: ''
                },
                design: {
                    listLayout: '',
                    itemLayout: '',
                    backgroundImage: ''
                }
            };

            var saveData = function (newObj, tag) {
                if (newObj == undefined)return;
                Buildfire.datastore.save(newObj, tag, function (err, result) {
                    if (err || !result)
                        console.error('------------error saveData-------', err);
                    else
                        console.log('------------data saved-------', result);
                });
            };

            var getContentItems = function (_searchOptions) {
                if (ContentHome.data && ContentHome.data.content.sortBy) {
                    ContentHome.sortPeopleBy(ContentHome.data.content.sortBy);
                } else {
                    Buildfire.datastore.search(_searchOptions, TAG_NAMES.PEOPLE, function (err, result) {
                        if (err) {
                            console.error('-----------err in getting list-------------', err);
                        }
                        else {
                            ContentHome.items = result;
                            if (result.length > _pageSize) {// to indicate there are more
                                console.log('-------More Data available--------');
                            }
                            $scope.$digest();
                        }
                    });
                }
            };

            var getContentPeopleInfo = function () {
                Buildfire.datastore.get(TAG_NAMES.PEOPLE_INFO, function (err, result) {
                    if (err && err.code !== ERROR_CODE.NOT_FOUND) {
                        console.error('-----------err-------------', err);
                    }
                    else if (err && err.code === ERROR_CODE.NOT_FOUND) {
                        saveData(JSON.parse(angular.toJson(_data)), TAG_NAMES.PEOPLE_INFO);
                    }
                    else if (result) {
                        ContentHome.data = result.data;
                        if (!ContentHome.data.content.sortBy) {
                            ContentHome.data.content.sortBy = ContentHome.sortingOptions[0];
                        }
                        $scope.$digest();
                        if (tmrDelayForPeopleInfo)clearTimeout(tmrDelayForPeopleInfo);
                    }
                    getContentItems(searchOptions);
                });
            };

            getContentPeopleInfo();

            ContentHome.openDeepLinkDialog = function () {
                ContentHome.DeepLinkCopyUrl = true;
                setTimeout(function () {
                    ContentHome.DeepLinkCopyUrl = false;
                    $scope.$apply();
                }, 1500);
            };

            ContentHome.openRemoveDialog = function () {
                window.openDialog('remove.html', null, 'sm', null);
            };

            ContentHome.openImportCSVDialog = function () {
                var modalInstance = $modal
                    .open({
                        templateUrl: 'home/modals/import-csv.html',
                        controller: 'ImportCSVPopupCtrl',
                        controllerAs: 'ImportCSVPopup',
                        size: 'sm'
                    });
                modalInstance.result.then(function (data) {
                    console.log('Data----------', data);
                }, function (data) {
                    if (data) {
                        console.log('Data----------', data);

                    }
                });
            };

            ContentHome.exportCSV = function () {
                if (ContentHome.items) {
                    var tempData = [];
                    angular.forEach(angular.copy(ContentHome.items), function (value) {
                        delete value.data.dateCreated;
                        tempData.push(value.data);
                    });
                    var json = JSON.parse(angular.toJson(tempData));
                    var csv = FormatConverter.JSON2CSV(json);
                    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    if (navigator.msSaveBlob) {  // IE 10+
                     navigator.msSaveBlob(blob, "Items.csv"); }
                    else {
                        var link = document.createElement("a");
                        if (link.download !== undefined) {
                            var url = URL.createObjectURL(blob);
                            link.setAttribute("href", url);
                            link.setAttribute("download", "MyData.csv");
                            link.style.visibility = 'hidden'; document.body.appendChild(link);
                            link.click(); document.body.removeChild(link); }
                    }
                }
            };

            ContentHome.getTemplate = function () {
                var tempData = [{
                    topImage: null,
                    iconImage: null,
                    fName: null,
                    lName: null,
                    position: null,
                    deepLinkUrl: null,
                    socailLinks: null,
                    bodyContent: null
                }];
                console.log('getTemplate method called');
                var json = JSON.parse(angular.toJson(tempData));
                console.log('json-------------------------------', json);
                var csv = FormatConverter.JSON2CSV(json);
                $window.open("data:text/csv;charset=utf-8," + escape(csv))
            };
            ContentHome.removeListItem = function (_index) {
                var modalInstance = $modal
                    .open({
                        templateUrl: 'home/modals/remove-people.html',
                        controller: 'RemovePeoplePopupCtrl',
                        controllerAs: 'RemovePeoplePopup',
                        size: 'sm',
                        resolve: {
                            peopleInfo: function () {
                                return ContentHome.items[_index];
                            }
                        }
                    });
                modalInstance.result.then(function (data) {
                    if (data)
                        ContentHome.items.splice(_index, 1);
                }, function (data) {
                    if (data) {
                        console.error('Error----------while removing people----', data)
                    }
                });
            };

            ContentHome.searchListItem = function (value) {
                var fullName = '';
                if (value) {
                    if (value.indexOf(' ') !== -1) {
                        fullName = value.trim().split(' ');
                        searchOptions.filter = {"$or": [{"$json.fName": fullName[0]}, {"$json.lName": fullName[1]}]};
                    } else {
                        fullName = value.trim();
                        searchOptions.filter = {"$or": [{"$json.fName": fullName}, {"$json.lName": fullName}]};
                    }
                    Buildfire.datastore.search(searchOptions, TAG_NAMES.PEOPLE, function (err, records) {
                        if (err)
                            console.error('There was a problem retrieving your data', err);
                        else {
                            ContentHome.items = records;
                            $scope.$digest();
                        }
                    });
                } else {
                    console.error('Blank name provided');
                }
            };

            ContentHome.sortPeopleBy = function (value) {
                switch (value) {
                    case MANUALLY:
                        delete searchOptions.sort;
                        break;
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
                }
                if (searchOptions) {
                    ContentHome.data.content.sortBy = value;
                    Buildfire.datastore.search(searchOptions, TAG_NAMES.PEOPLE, function (err, records) {
                        if (err)
                            console.error('There was a problem retrieving your data');
                        else {
                            ContentHome.items = records;
                            $scope.$digest();
                        }
                    });
                } else if (value && !searchOptions) {
                    ContentHome.data.content.sortBy = value;
                } else {
                    console.error('There was a problem sorting your data');
                }
            };

            ContentHome.openAddCarouselImagePopup = function () {
                var modalInstance = $modal
                    .open({
                        templateUrl: 'home/modals/add-carousel-image.html',
                        controller: 'AddCarouselImagePopupCtrl',
                        controllerAs: 'AddCarouselImagePopup',
                        size: 'sm'
                    });
                modalInstance.result.then(function (imageInfo) {
                    if (imageInfo && ContentHome.data) {
                        ContentHome.data.content.images.push(JSON.parse(angular.toJson(imageInfo)));
                    } else {
                        console.error('Unable to load data.')
                    }
                }, function (err) {
                    if (err) {
                        console.error('Error:', err)
                    }
                });
            };

            ContentHome.openAddImageLinkPopup = function (_index) {
                var modalInstance = $modal
                    .open({
                        templateUrl: 'home/modals/add-image-link.html',
                        controller: 'AddImageLinkPopupCtrl',
                        controllerAs: 'AddImageLinkPopup',
                        size: 'sm'
                    });
                modalInstance.result.then(function (_link) {
                    if (_link && ContentHome.data) {
                        ContentHome.data.content.images[_index].link = _link;
                    } else {
                        console.error('Unable to load data.')
                    }
                }, function (err) {
                    if (err) {
                        console.error('Error:', err)
                    }
                });
            };

            ContentHome.removeCarouselImage = function ($index) {
                var modalInstance = $modal
                    .open({
                        templateUrl: 'home/modals/remove-image-link.html',
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
                    if (data) {
                        console.error('Error----------while removing image----', data)
                    }
                });
            };

            Buildfire.datastore.onUpdate(function (event) {
                if (event && event.tag === TAG_NAMES.PEOPLE_INFO) {
                    ContentHome.data = event.obj;
                    $scope.$digest();
                    if (tmrDelayForPeopleInfo)clearTimeout(tmrDelayForPeopleInfo);
                } else if (event && event.tag === TAG_NAMES.PEOPLE) {
                    ContentHome.items = event.obj;
                    $scope.$digest();
                }
            });
            var saveDataWithDelay = function (newObj) {
                if (newObj) {
                    if (tmrDelayForPeopleInfo)clearTimeout(tmrDelayForPeopleInfo);
                    tmrDelayForPeopleInfo = setTimeout(function () {
                        saveData(JSON.parse(angular.toJson(newObj)), TAG_NAMES.PEOPLE_INFO);
                    }, 500);
                }
            };

            $scope.$watch(function () {
                return ContentHome.data;
            }, saveDataWithDelay, true);

        }])
})(window.angular, window);

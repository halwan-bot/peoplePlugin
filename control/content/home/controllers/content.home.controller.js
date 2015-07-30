'use strict';

(function (angular, window) {
    angular
        .module('peoplePluginContent')
        .controller('ContentHomeCtrl', ['$scope', '$window', '$modal', 'Buildfire', 'TAG_NAMES', 'ERROR_CODE', function ($scope, $window, $modal, Buildfire, TAG_NAMES, ERROR_CODE) {
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
                    filter: {"$json.fName": {"$regex": '/*'}}
                    , page: _page
                    , pageSize: _pageSize + 1 // the plus one is to check if there are any more
                };

            var _self = this;
            _self.items = null;
            _self.data = null;
            _self.sortingOptions = [
                MANUALLY,
                OLDEST_TO_NEWEST,
                NEWEST_TO_OLDEST,
                FIRST_NAME_A_TO_Z,
                FIRST_NAME_Z_TO_A,
                LAST_NAME_A_TO_Z,
                LAST_NAME_Z_TO_A
            ];
            _self.imageSortableOptions = {
                handle: '> .cursor-grab'
            };
            _self.itemSortableOptions = {
                handle: '> .cursor-grab',
                stop: function (e, ui) {
                    _self.data.content.sortBy = _self.sortingOptions[0];
                }
            };
            _self.DeepLinkCopyUrl = false;
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
                Buildfire.datastore.search(_searchOptions, TAG_NAMES.PEOPLE, function (err, result) {
                    if (err) {
                        console.error('-----------err in getting list-------------', err);
                    }
                    else {
                        _self.items = result;
                        if (result.length > _pageSize) {// to indicate there are more
                            console.log('-------More Data available--------');
                        }
                        $scope.$digest();
                    }
                });
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
                        _self.data = result.data;
                        if (!_self.data.content.sortBy) {
                            _self.data.content.sortBy = _self.sortingOptions[0];
                        }
                        $scope.$digest();
                        if (tmrDelayForPeopleInfo)clearTimeout(tmrDelayForPeopleInfo);
                    }
                    getContentItems(searchOptions);
                });
            };

            getContentPeopleInfo();

            _self.openDeepLinkDialog = function () {
                _self.DeepLinkCopyUrl = true;
                setTimeout(function () {
                    _self.DeepLinkCopyUrl = false;
                    $scope.$apply();
                }, 1500);
            };

            _self.openRemoveDialog = function () {
                window.openDialog('remove.html', null, 'sm', null);
            };

            _self.openImportCSVDialog = function () {
                var modalInstance = $modal
                    .open({
                        templateUrl: 'home/modals/import-csv.html',
                        controller: 'ImportCSVPopupCtrl',
                        controllerAs: 'ImportCSVPopup',
                        size: 'sm'
                    });
                modalInstance.result.then(function (data) {
                    console.log('Data----------',data);
                }, function (data) {
                    if (data) {
                        console.log('Data----------',data);

                    }
                });
            };

            _self.removeListItem = function (_index) {
                var modalInstance = $modal
                    .open({
                        templateUrl: 'home/modals/remove-people.html',
                        controller: 'RemovePeoplePopupCtrl',
                        controllerAs: 'RemovePeoplePopup',
                        size: 'sm',
                        resolve: {
                            peopleInfo: function () {
                                return _self.items[_index];
                            }
                        }
                    });
                modalInstance.result.then(function (data) {
                    if (data)
                        _self.items.splice(_index, 1);
                }, function (data) {
                    if (data) {
                        console.error('Error----------while removing people----', data)
                    }
                });
            };

            _self.searchListItem = function (value) {

            };

            _self.sortPeopleBy = function (value) {
                switch (value) {
                    case MANUALLY:
                        delete searchOptions.sort;
                        break;
                    case OLDEST_TO_NEWEST:
                        searchOptions.sort = {"field": "dateCrated", "desc": false};
                        break;
                    case NEWEST_TO_OLDEST:
                        searchOptions.sort = {"field": "dateCrated", "desc": true};
                        break;
                    case FIRST_NAME_A_TO_Z:
                        searchOptions.sort = {"field": "fName", "desc": false};
                        break;
                    case FIRST_NAME_Z_TO_A:
                        searchOptions.sort = {"field": "fName", "desc": true};
                        break;
                    case LAST_NAME_A_TO_Z:
                        searchOptions.sort = {"field": "lName", "desc": false};
                        break;
                    case LAST_NAME_Z_TO_A:
                        searchOptions.sort = {"field": "lName", "desc": true};
                        break;
                }
                if (searchOptions) {
                    _self.data.content.sortBy = value;
                    Buildfire.datastore.search(searchOptions, TAG_NAMES.PEOPLE, function (err, records) {
                        if (err)
                            console.error('There was a problem retrieving your data');
                        else {
                            _self.items=records;
                            $scope.$digest();
                        }
                    });
                } else if (value && !searchOptions) {
                    _self.data.content.sortBy = value;
                } else {
                    console.error('There was a problem sorting your data');
                }
            };

            _self.openAddCarouselImagePopup = function () {
                var modalInstance = $modal
                    .open({
                        templateUrl: 'home/modals/add-carousel-image.html',
                        controller: 'AddCarouselImagePopupCtrl',
                        controllerAs: 'AddCarouselImagePopup',
                        size: 'sm'
                    });
                modalInstance.result.then(function (imageInfo) {
                    if (imageInfo && _self.data) {
                        _self.data.content.images.push(JSON.parse(angular.toJson(imageInfo)));
                    } else {
                        console.error('Unable to load data.')
                    }
                }, function (err) {
                    if (err) {
                        console.error('Error:', err)
                    }
                });
            };

            _self.openAddImageLinkPopup = function (_index) {
                var modalInstance = $modal
                    .open({
                        templateUrl: 'home/modals/add-image-link.html',
                        controller: 'AddImageLinkPopupCtrl',
                        controllerAs: 'AddImageLinkPopup',
                        size: 'sm'
                    });
                modalInstance.result.then(function (_link) {
                    if (_link && _self.data) {
                        _self.data.content.images[_index].link = _link;
                    } else {
                        console.error('Unable to load data.')
                    }
                }, function (err) {
                    if (err) {
                        console.error('Error:', err)
                    }
                });
            };

            _self.removeCarouselImage = function ($index) {
                var modalInstance = $modal
                    .open({
                        templateUrl: 'home/modals/remove-image-link.html',
                        controller: 'RemoveImagePopupCtrl',
                        controllerAs: 'RemoveImagePopup',
                        size: 'sm',
                        resolve: {
                            imageInfo: function () {
                                return _self.data.content.images[$index]
                            }
                        }
                    });
                modalInstance.result.then(function (data) {
                    if (data)
                        _self.data.content.images.splice($index, 1);
                }, function (data) {
                    if (data) {
                        console.error('Error----------while removing image----', data)
                    }
                });
            };

            Buildfire.datastore.onUpdate(function (event) {
                if (event && event.tag === TAG_NAMES.PEOPLE_INFO) {
                    _self.data = event.obj;
                    $scope.$digest();
                    if (tmrDelayForPeopleInfo)clearTimeout(tmrDelayForPeopleInfo);
                } else if (event && event.tag === TAG_NAMES.PEOPLE) {
                    _self.items = event.obj;
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
                return _self.data;
            }, saveDataWithDelay, true);

        }])
})(window.angular, window);

'use strict';

(function (angular, window) {
    angular
        .module('peoplePluginContent')
        .controller('ContentHomeCtrl', ['$scope', '$window', '$modal', 'Buildfire', 'TAG_NAMES', 'ERROR_CODE', function ($scope, $window, $modal, Buildfire, TAG_NAMES, ERROR_CODE) {
            var _self = this;
            _self.items = null;
            _self.data = null;
            _self.sortingOptions = [
                'Manually',
                'Oldest to Newest',
                'Newest to Oldest',
                'First Name A-Z',
                'First Name Z-A',
                'Last Name A-Z',
                'Last Name Z-A'
            ];
            _self.DeepLinkCopyUrl = false;
            var tmrDelayForPeopleInfo = null;
            var tmrDelayForPeoples = null;
            var _data = {
                content: {
                    images: [{
                        title: 'default',
                        imageUrl: 'http://www.placehold.it/80x50',
                        deepLinkUrl: ''
                    }],
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
            var getContentItems = function () {
                Buildfire.datastore.get(TAG_NAMES.PEOPLES, function (err, result) {
                    if (err && err.code !== ERROR_CODE.NOT_FOUND) {
                        console.error('-----------err in getting list-------------', err);
                    }
                    else if (result) {
                        _self.items = result.data;
                        $scope.$digest();
                        if (tmrDelayForPeoples)clearTimeout(tmrDelayForPeoples);
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
                        //TODO: for testing purpose remove this after implementation
                        _self.data.content.images = [

                            {
                                title: 'deepak',
                                imageUrl: 'http://www.placehold.it/80x50',
                                deepLinkUrl: ''
                            },
                            {
                                title: 'sandeep',
                                imageUrl: 'http://www.placehold.it/80x50',
                                deepLinkUrl: ''
                            },
                            {
                                title: 'vineeta',
                                imageUrl: 'http://www.placehold.it/80x50',
                                deepLinkUrl: ''
                            }
                        ];
                        $scope.$digest();
                        if (tmrDelayForPeopleInfo)clearTimeout(tmrDelayForPeopleInfo);
                    }
                    getContentItems();
                });
            };
            getContentPeopleInfo();

            _self.openDeepLinkDialog = function ($event) {
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
                window.openDialog('importCSV.html', null, 'sm', null);
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
            _self.sortPeoplesBy = function (value) {
                _self.data.content.sortBy = value;
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
                    }else{
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
                } else if (event && event.tag === TAG_NAMES.PEOPLES) {
                    _self.items = event.obj;
                    $scope.$digest();
                    if (tmrDelayForPeoples)clearTimeout(tmrDelayForPeoples);
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
            var saveItemsWithDelay = function (newItems) {
                if (newItems) {
                    if (tmrDelayForPeoples)clearTimeout(tmrDelayForPeoples);
                    tmrDelayForPeoples = setTimeout(function () {
                        saveData(JSON.parse(angular.toJson(newItems)), TAG_NAMES.PEOPLES);
                    }, 500);
                }
            };
            $scope.$watch(function () {
                return _self.data;
            }, saveDataWithDelay, true);

            $scope.$watch(function () {
                return _self.items;
            }, saveItemsWithDelay, true);

        }])
})(window.angular, window);

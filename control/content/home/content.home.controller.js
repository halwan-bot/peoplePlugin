'use strict';

(function (angular, window) {
    angular
        .module('peoplePluginContent')
        .controller('ContentHomeCtrl', ['$scope', 'Buildfire', 'TAG_NAMES', 'ERROR_CODE', function ($scope, Buildfire, TAG_NAMES, ERROR_CODE) {
            var _self = this;
            _self.items = null;
            $scope.sortableOptions = {
            };

            _self.sortingOptions = [
                'Newest',
                'Oldest',
                'Most Items',
                'Least Items'
            ];
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

            _self.openDeepLinkDialog = function () {
                window.openDialog('deepLink.html', null, 'sm', null);
            };
            _self.openRemoveDialog = function () {
                window.openDialog('remove.html', null, 'sm', null);
            };
            _self.openImportCSVDialog = function () {
                window.openDialog('importCSV.html', null, 'sm', null);
            };
            _self.removeListItem = function (_index) {
                _self.items.splice(_index, 1);
            };
            _self.searchListItem = function (value) {

            };
            _self.sortPeoplesBy = function (value) {
                _self.data.content.sortBy = value;
            };
            _self.removeCarouselImage=function($index){
                _self.data.content.images.splice($index,1);
            };

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
                    if (tmrDelay)clearTimeout(tmrDelay);
                }
            });
            Buildfire.datastore.get(TAG_NAMES.PEOPLES, function (err, result) {
                if (err && err.code !== ERROR_CODE.NOT_FOUND) {
                    console.error('-----------err in getting list-------------', err);
                }
                else if (result) {
                    _self.items = result.data;
                    $scope.$digest();
                    if (tmrDelay)clearTimeout(tmrDelay);
                }
            });
            Buildfire.datastore.onUpdate(function (result) {
                console.log('Onupdate------------------------------',result);
                if (result && result.tag === TAG_NAMES.PEOPLE_INFO) {
                    console.log('-----------Data Updated Successfully-------------', result.obj);
                    if (tmrDelay)clearTimeout(tmrDelay);
                } else if (result && result.tag === TAG_NAMES.PEOPLES) {
                    console.log('-----------Data Updated Successfully-------------', result.obj);
                    if (tmrDelay)clearTimeout(tmrDelay);
                }

            });

            var tmrDelay = null;
            var saveDataWithDelay = function (newObj) {
                if (tmrDelay)clearTimeout(tmrDelay);
                tmrDelay = setTimeout(function () {
                    saveData(JSON.parse(angular.toJson(newObj)), TAG_NAMES.PEOPLE_INFO);
                }, 500);
            };

            var saveItemsWithDelay = function (newObj) {
                if (tmrDelay)clearTimeout(tmrDelay);
                tmrDelay = setTimeout(function () {
                    saveData(JSON.parse(angular.toJson(newObj)), TAG_NAMES.PEOPLES);
                }, 500);
            };

            $scope.$watch(function () {
                return _self.data;
            }, saveDataWithDelay, true);

            $scope.$watch(function () {
                return _self.items;
            }, saveItemsWithDelay, true);
        }])
})(window.angular, window);

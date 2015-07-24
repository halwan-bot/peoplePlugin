'use strict';

(function (angular) {
    angular.module('peoplePluginContent')
        .controller('ContentPeoplesCtrl', ['$scope', 'Buildfire', 'TAG_NAMES', 'ERROR_CODE', function ($scope, Buildfire, TAG_NAMES, ERROR_CODE) {
            var _self = this;
            var _items = [
                {
                    topImage: '',
                    iconImage: 'http://www.placehold.it/50x50',
                    fName: 'Sandeep',
                    lName: 'Chhapola',
                    position: 'Developer',
                    deepLinkUrl: 'apppID/45678979',
                    description: 'hot',
                    links: []
                },
                {
                    topImage: '',
                    iconImage: 'http://www.placehold.it/50x50',
                    fName: 'Mohit',
                    lName: 'Tyagi',
                    position: 'Developer',
                    deepLinkUrl: 'apppID/45678979',
                    description: 'cool',
                    links: []
                },
                {
                    topImage: '',
                    iconImage: 'http://www.placehold.it/50x50',
                    fName: 'Dheeraj',
                    lName: 'Sharma',
                    position: 'Developer',
                    deepLinkUrl: 'apppID/45678979',
                    description: 'cool',
                    links: []
                },
                {
                    topImage: '',
                    iconImage: 'http://www.placehold.it/50x50',
                    fName: 'Deepak',
                    lName: 'Sharma',
                    position: 'Developer',
                    deepLinkUrl: 'apppID/45678979',
                    description: 'cool',
                    links: []
                },
                {
                    topImage: '',
                    iconImage: 'http://www.placehold.it/50x50',
                    fName: 'Vineeta',
                    lName: 'Sharma',
                    position: 'Developer',
                    deepLinkUrl: 'apppID/45678979',
                    description: 'clever',
                    links: []
                }
            ];
            var saveData = function (newObj, tag) {
                if (newObj == undefined)return;
                Buildfire.datastore.save(newObj, tag, function (err, result) {
                    if (err || !result)
                        console.log('------------error saveData-------', err);
                    else
                        console.log('------------data saved-------', result);
                });
            };


            Buildfire.datastore.get(TAG_NAMES.PEOPLES, function (err, result) {
                if (err && err.code !== ERROR_CODE.NOT_FOUND) {
                    console.error('-----------err-------------', err);
                }
                else if (err && err.code === ERROR_CODE.NOT_FOUND) {
                    saveData(JSON.parse(angular.toJson(_items)), TAG_NAMES.PEOPLES);
                }
                else if (result) {
                    _self.items = result.data;
                    $scope.$digest();
                    if (tmrDelay)clearTimeout(tmrDelay);
                }
            });

            Buildfire.datastore.onUpdate(function (err, result) {
                if (err) {
                    console.error('------------Err in peoples-------', err);
                }
                else if (result && result.detail.tag === TAG_NAMES.PEOPLES) {
                    _self.items = result.detail.obj;
                    if (tmrDelay)clearTimeout(tmrDelay);
                }
            });


            var tmrDelay = null;
            var saveItemsWithDelay = function (newObj) {
                if (tmrDelay)clearTimeout(tmrDelay);
                tmrDelay = setTimeout(function () {
                    saveData(JSON.parse(angular.toJson(newObj)), TAG_NAMES.PEOPLES);
                }, 500);
            };

            $scope.$watch(function () {
                return _self.items;
            }, saveItemsWithDelay, true);
        }]);
})(window.angular, window);

'use strict';
(function (angular) {
    angular
        .module('peoplePluginContent')
        .controller('UpdateContentPeopleCtrl', ['$scope', '$location', '$routeParams', '$modal', 'Buildfire', 'TAG_NAMES', 'STATUS_CODE',
            function ($scope, $location, $routeParams, $modal, Buildfire, TAG_NAMES, STATUS_CODE) {

                var itemId = $routeParams.itemId;
                if(!itemId){
                    console.error('-------------Blank itemId provided-------------');
                    $location.path("/");
                    return;
                }

                var ContentPeople = this;
                ContentPeople.isUpdating=true;
                ContentPeople.linksSortableOptions = {
                    handle: '> .cursor-grab'
                };
                ContentPeople.item = null;

                var getPeopleDetail = function () {
                    Buildfire.datastore.get(TAG_NAMES.PEOPLE, itemId, function (err, result) {
                        if (err && err.code !== ERROR_CODE.NOT_FOUND) {
                            console.error('-----------Unable to load data-------------', err);
                        }
                        else {
                            ContentPeople.item = result.data;
                            console.log('-----------Data to update-------------',  result);
                            $scope.$digest();
                            if (tmrDelayForPeoples)clearTimeout(tmrDelayForPeoples);
                        }
                    });
                };

                getPeopleDetail();

//                On click button done it redirects to home
                ContentPeople.done = function () {
                    $location.path("/");
                };

                ContentPeople.updateItemData = function (_id, data) {
                    if (_id && ContentPeople.item) {
                        Buildfire.datastore.update(_id, data, TAG_NAMES.PEOPLE, function (err) {
                            if (err)
                                console.error('There was a problem saving your data');
                        })
                    }
                };

                Buildfire.datastore.onUpdate(function (event) {
                    if (event && event.status) {
                        switch (event.status) {
                            case STATUS_CODE.UPDATED:
                                console.log('Data updated Successfully');
                                break;
                        }
                    }
                });

                ContentPeople.openAddLinkPopup = function () {
                    var modalInstance = $modal
                        .open({
                            templateUrl: 'people/modals/add-item-link.html',
                            controller: 'AddItemLinkPopupCtrl',
                            controllerAs: 'AddItemLinkPopup',
                            size: 'sm'
                        });
                    modalInstance.result.then(function (_link) {
                        if (_link) {
                            ContentPeople.item.socailLinks.push(JSON.parse(angular.toJson(_link)));
                        }
                    }, function (err) {
                        if (err) {
                            console.error('Error:', err)
                        }
                    });
                };

                ContentPeople.removeLink = function (_index) {
                    ContentPeople.item.socailLinks.splice(_index, 1);
                };

                var options = {showIcons: false, multiSelection: false};
                var callback = function (error, result) {
                    if (error) {
                        console.error('Error:', error);
                    } else {
                        ContentPeople.item.topImage = result.selectedFiles && result.selectedFiles[0] || null;
                        $scope.$digest();
                    }
                };

                ContentPeople.selectTopImage = function () {
                    Buildfire.imageLib.showDialog(options, callback);
                };

                ContentPeople.removeTopImage = function () {
                    ContentPeople.item.topImage = null;
                };

                var tmrDelayForPeoples = null;
                var updateItemsWithDelay = function (newObj) {
                    if (tmrDelayForPeoples)clearTimeout(tmrDelayForPeoples);
                    tmrDelayForPeoples = setTimeout(function () {
                        ContentPeople.updateItemData(itemId, JSON.parse(angular.toJson(newObj)), TAG_NAMES.PEOPLE);
                    }, 500);
                };

                $scope.$watch(function () {
                    return ContentPeople.item;
                }, updateItemsWithDelay, true);
            }]);
})(window.angular);

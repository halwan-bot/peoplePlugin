'use strict';
(function (angular) {
    angular
        .module('peoplePluginContent')
        .controller('ContentPeopleCtrl', ['$scope', '$location', '$modal', 'Buildfire', 'TAG_NAMES', 'STATUS_CODE', '$routeParams',
            function ($scope, $location, $modal, Buildfire, TAG_NAMES, STATUS_CODE, $routeParams) {
                var ContentPeople = this;
                ContentPeople.isUpdating = false;
                ContentPeople.linksSortableOptions = {
                    handle: '> .cursor-grab'
                };
                ContentPeople.item = {};
                var _data = {
                    topImage: '',
                    iconImage: '',
                    fName: '',
                    lName: '',
                    position: '',
                    deepLinkUrl: '',
                    dateCreated: +new Date(),
                    socailLinks: [],
                    bodyContent: ''
                };

                function updateMasterItem(item) {
                    ContentPeople.masterItem = angular.copy(item);
                }

                function resetItem() {
                    ContentPeople.item = angular.copy(ContentPeople.masterItem);
                }

                function isUnchanged(item) {
                    return angular.equals(item, ContentPeople.masterItem);
                }

                /*On click button done it redirects to home*/
                ContentPeople.done = function () {
                    $location.path("/");
                };

                /*On click button delete it removes current item from datastore*/
                ContentPeople.deleteItem = function () {
                    $location.path("/");
                };


                ContentPeople.addNewItem = function () {
                    if ($routeParams.itemId) {
                        Buildfire.datastore.getById($routeParams.itemId,TAG_NAMES.PEOPLE, function (err, data) {
                            if (err)
                                console.error('There was a problem saving your data');
                            ContentPeople.item = data.data;
                            updateMasterItem(ContentPeople.item);
                            $scope.$digest();
                        })
                    } else {
                        Buildfire.datastore.insert(JSON.parse(angular.toJson(_data)), TAG_NAMES.PEOPLE, false, function (err, data) {
                            if (err) {
                                console.error('There was a problem saving your data');
                            }
                            else {
                                Buildfire.datastore.getById(data.id,TAG_NAMES.PEOPLE, function (err, data) {
                                    if (err)
                                        console.error('There was a problem saving your data');
                                    ContentPeople.item = data.data;
                                    updateMasterItem(ContentPeople.item);
                                    $scope.$digest();
                                });
                            }
                        });
                    }
                };
                ContentPeople.addNewItem();

                ContentPeople.updateItemData = function (item) {
                    if (!isUnchanged(item)) {
                        if (item && item.id) {
                            Buildfire.datastore.update(item.id, item, TAG_NAMES.PEOPLE, function (err) {
                                if (err)
                                    console.error('There was a problem saving your data');
                            })
                        } else {
                            Buildfire.datastore.insert(JSON.parse(angular.toJson(item.data)), TAG_NAMES.PEOPLE, false, function (err, data) {
                                if (err) {
                                    console.error('There was a problem saving your data');
                                }
                                else {
                                    Buildfire.datastore.getById(data.id,TAG_NAMES.PEOPLE, function (err, data) {
                                        if (err)
                                            console.error('There was a problem saving your data');
                                        ContentPeople.item = data;
                                        updateMasterItem(ContentPeople.item);
                                        $scope.$digest();
                                    });
                                }
                            });
                            console.error('Blank id Provided');
                        }
                    }
                };
                Buildfire.datastore.onUpdate(function (event) {
                    if (event && event.status) {
                        switch (event.status) {
                            case STATUS_CODE.INSERTED:
                                console.log('Data inserted Successfully');
                                break;
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
                            ContentPeople.item.data.socailLinks.push(JSON.parse(angular.toJson(_link)));
                        }
                    }, function (err) {
                        if (err) {
                            console.error('Error:', err)
                        }
                    });
                };

                ContentPeople.removeLink = function (_index) {
                    ContentPeople.item.data.socailLinks.splice(_index, 1);
                };

                var options = {showIcons: false, multiSelection: false};
                var callback = function (error, result) {
                    if (error) {
                        console.error('Error:', error);
                    } else {
                        ContentPeople.item.data.topImage = result.selectedFiles && result.selectedFiles[0] || null;
                        $scope.$digest();
                    }
                };

                ContentPeople.selectTopImage = function () {
                    Buildfire.imageLib.showDialog(options, callback);
                };

                ContentPeople.removeTopImage = function () {
                    ContentPeople.item.data.topImage = null;
                };


                var tmrDelayForPeoples = null;
                var updateItemsWithDelay = function (newObj) {
                    if (tmrDelayForPeoples)clearTimeout(tmrDelayForPeoples);
                    if (ContentPeople.item) {
                        tmrDelayForPeoples = setTimeout(function () {
                            ContentPeople.updateItemData(JSON.parse(angular.toJson(newObj)), TAG_NAMES.PEOPLE);
                        }, 1000);
                    }
                };

                $scope.$watch(function () {
                    return ContentPeople.item;
                }, updateItemsWithDelay, true);
            }]);
})(window.angular);

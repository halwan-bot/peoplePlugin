'use strict';
(function (angular) {
    angular
        .module('peoplePluginContent')
        .controller('ContentPeopleCtrl', ['$scope', '$location', '$modal', 'Buildfire', 'TAG_NAMES', 'STATUS_CODE',
            function ($scope, $location, $modal, Buildfire, TAG_NAMES, STATUS_CODE) {
                var ContentPeople = this;
                ContentPeople.isUpdating=false;
                ContentPeople.linksSortableOptions = {
                    handle: '> .cursor-grab'
                };
                ContentPeople.item = {
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

//              var currentInsertedItemId = null;

                /*On click button done it redirects to home*/
                /*ContentPeople.done = function () {
                    $location.path("/");
                };*/

                ContentPeople.addNewItem = function () {
                    Buildfire.datastore.insert(JSON.parse(angular.toJson(ContentPeople.item)), TAG_NAMES.PEOPLE, false, function (err, data) {
                        if (err) {
                            console.error('There was a problem saving your data');
                        }
                        else {
                         //   currentInsertedItemId = data.id;
                        }
                    });
                    $location.path("/");
                };

               /* ContentPeople.updateItemData = function (_id, data) {
                    if (_id) {
                        Buildfire.datastore.update(_id, data, TAG_NAMES.PEOPLE, function (err) {
                            if (err)
                                console.error('There was a problem saving your data');
                        })
                    } else {
                        ContentPeople.addNewItem();
                    }
                };
*/
                Buildfire.datastore.onUpdate(function (event) {
                    if (event && event.status) {
                        switch (event.status) {
                            case STATUS_CODE.INSERTED:
                                //currentInsertedItemId = event.id;
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

/*
                var tmrDelayForPeoples = null;
                var updateItemsWithDelay = function (newObj) {
                    if (tmrDelayForPeoples)clearTimeout(tmrDelayForPeoples);
                    tmrDelayForPeoples = setTimeout(function () {
                        ContentPeople.updateItemData(currentInsertedItemId, JSON.parse(angular.toJson(newObj)), TAG_NAMES.PEOPLE);
                    }, 500);
                };

                $scope.$watch(function () {
                    return ContentPeople.item;
                }, updateItemsWithDelay, true);
*/
            }]);
})(window.angular);

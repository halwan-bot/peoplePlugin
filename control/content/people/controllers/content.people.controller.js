'use strict';
(function (angular) {
    angular
        .module('peoplePluginContent')
        .controller('ContentPeopleCtrl', ['$scope', '$location', '$modal', 'Buildfire', 'TAG_NAMES', 'STATUS_CODE',
            function ($scope, $location, $modal, Buildfire, TAG_NAMES, STATUS_CODE) {
                var _self = this;
                _self.linksSortableOptions = {
                    handle: '> .cursor-grab'
                };
                _self.item = {
                    topImage: '',
                    iconImage: '',
                    fName: '',
                    lName: '',
                    position: '',
                    deepLinkUrl: '',
                    dateCrated: +new Date(),
                    socailLinks: [],
                    bodyContent: ''
                };

//              var currentInsertedItemId = null;

                /*On click button done it redirects to home*/
                /*_self.done = function () {
                    $location.path("/");
                };*/

                _self.addNewItem = function () {
                    Buildfire.datastore.insert(JSON.parse(angular.toJson(_self.item)), TAG_NAMES.PEOPLE, false, function (err, data) {
                        if (err) {
                            console.error('There was a problem saving your data');
                        }
                        else {
                         //   currentInsertedItemId = data.id;
                        }
                    });
                    $location.path("/");
                };

               /* _self.updateItemData = function (_id, data) {
                    if (_id) {
                        Buildfire.datastore.update(_id, data, TAG_NAMES.PEOPLE, function (err) {
                            if (err)
                                console.error('There was a problem saving your data');
                        })
                    } else {
                        _self.addNewItem();
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

                _self.openAddLinkPopup = function () {
                    var modalInstance = $modal
                        .open({
                            templateUrl: 'people/modals/add-item-link.html',
                            controller: 'AddItemLinkPopupCtrl',
                            controllerAs: 'AddItemLinkPopup',
                            size: 'sm'
                        });
                    modalInstance.result.then(function (_link) {
                        if (_link) {
                            _self.item.socailLinks.push(JSON.parse(angular.toJson(_link)));
                        }
                    }, function (err) {
                        if (err) {
                            console.error('Error:', err)
                        }
                    });
                };

                _self.removeLink = function (_index) {
                    _self.item.socailLinks.splice(_index, 1);
                };

                var options = {showIcons: false, multiSelection: false};
                var callback = function (error, result) {
                    if (error) {
                        console.error('Error:', error);
                    } else {
                        _self.item.topImage = result.selectedFiles && result.selectedFiles[0] || null;
                        $scope.$digest();
                    }
                };

                _self.selectTopImage = function () {
                    Buildfire.imageLib.showDialog(options, callback);
                };

                _self.removeTopImage = function () {
                    _self.item.topImage = null;
                };

/*
                var tmrDelayForPeoples = null;
                var updateItemsWithDelay = function (newObj) {
                    if (tmrDelayForPeoples)clearTimeout(tmrDelayForPeoples);
                    tmrDelayForPeoples = setTimeout(function () {
                        _self.updateItemData(currentInsertedItemId, JSON.parse(angular.toJson(newObj)), TAG_NAMES.PEOPLE);
                    }, 500);
                };

                $scope.$watch(function () {
                    return _self.item;
                }, updateItemsWithDelay, true);
*/
            }]);
})(window.angular);

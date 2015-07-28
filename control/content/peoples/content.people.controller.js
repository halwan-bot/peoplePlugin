'use strict';
(function (angular) {
    angular
        .module('peoplePluginContent')
        .controller('ContentPeoplesCtrl', ['$scope', '$location', '$modal', 'Buildfire', 'TAG_NAMES', 'ERROR_CODE',
            function ($scope, $location, $modal, Buildfire, TAG_NAMES, ERROR_CODE) {
                var _self = this;
                _self.items = [];

                _self.item = {
                    topImage: '',
                    fName: '',
                    lName: '',
                    position: '',
                    deepLinkUrl: '',
                    bodyContent: '',
                    links: []
                };

                var saveData = function (newObj, tag) {
                    if (newObj == undefined)return;
                    Buildfire.datastore.save(newObj, tag, function (err, result) {
                        if (err || !result)
                            console.log('------------error saveData-------', err);
                        else
                            console.log('------------data saved-------', result);
                    });
                };

                _self.addNewItem = function (path) {
                    _self.items.push(_self.item);
                    $location.path(path)
                };

                Buildfire.datastore.get(TAG_NAMES.PEOPLES, function (err, result) {
                    if (err && err.code !== ERROR_CODE.NOT_FOUND) {
                        console.error('-----------err-------------', err);
                    }
                    else if (err && err.code === ERROR_CODE.NOT_FOUND) {
                        saveData(JSON.parse(angular.toJson(_self.items)), TAG_NAMES.PEOPLES);
                    }
                    else if (result) {
                        _self.items = result.data;
                        $scope.$digest();
                        if (tmrDelayForPeoples)clearTimeout(tmrDelayForPeoples);
                    }
                });

                Buildfire.datastore.onUpdate(function (event) {
                    if (event && event.tag === TAG_NAMES.PEOPLES) {
                        _self.items = event.obj;
                        if (tmrDelayForPeoples)clearTimeout(tmrDelayForPeoples);
                    }
                    else if (event && event.tag === TAG_NAMES.PEOPLE_INFO) {
                        console.error('-----------PeopleInfo Data Updated Successfully-------------', event.obj);
                    }
                });

                _self.openAddLinkPopup = function () {
                    var modalInstance = $modal
                        .open({
                            templateUrl: 'home/modals/add-item-link.html',
                            controller: 'AddItemLinkPopupCtrl',
                            controllerAs: 'AddItemLinkPopup',
                            size: 'sm'
                        });
                    modalInstance.result.then(function (_link) {
                        if (_link) {
                            _self.item.links.push(JSON.parse(angular.toJson(_link)));
                        }
                    }, function (err) {
                        if (err) {
                            console.error('Error:', err)
                        }
                    });
                };

                _self.removeLink = function (_index) {
                    _self.item.links.splice(_index, 1);
                };
                var tmrDelayForPeoples = null;
                var saveItemsWithDelay = function (newObj) {
                    if (tmrDelayForPeoples)clearTimeout(tmrDelayForPeoples);
                    tmrDelayForPeoples = setTimeout(function () {
                        saveData(JSON.parse(angular.toJson(newObj)), TAG_NAMES.PEOPLES);
                    }, 500);
                };

      var options = {showIcons: false, multiSelection: false};
      var callback = function (error, result) {
        console.log(error,result);
        _self.selectedTopImage = result.selectedFiles && result.selectedFiles[0] || null;
        _self.item.topImage =  _self.selectedTopImage;
        $scope.$digest();
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

                $scope.$watch(function () {
                    return _self.items;
                }, saveItemsWithDelay, true);
            }]);
})(window.angular);

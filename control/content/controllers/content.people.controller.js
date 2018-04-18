'use strict';
(function (angular, buildfire) {
  angular
    .module('peoplePluginContent')
    .controller('ContentPeopleCtrl', ['$scope', 'Location', '$modal', 'Buildfire', 'TAG_NAMES', 'STATUS_CODE', '$routeParams', 'RankOfLastItem', '$rootScope',
      function ($scope, Location, $modal, Buildfire, TAG_NAMES, STATUS_CODE, $routeParams, RankOfLastItem, $rootScope) {
        var _rankOfLastItem = RankOfLastItem.getRank();
        var ContentPeople = this;
        ContentPeople.isUpdating = false;
        ContentPeople.isNewItemInserted = false;
        ContentPeople.unchangedData = true;
        ContentPeople.linksSortableOptions = {
          handle: '> .cursor-grab'
        };
        var _data = {
          topImage: '',
          fName: '',
          lName: '',
          position: '',
          deepLinkUrl: '',
          dateCreated: "",
          socialLinks: [],
          bodyContent: '',
          rank: _rankOfLastItem
        };

        //Scroll current view to top when page loaded.
        buildfire.navigation.scrollTop();

        ContentPeople.item = {
          data: angular.copy(_data)
        };

        ContentPeople.bodyContentWYSIWYGOptions = {
          plugins: 'advlist autolink link image lists charmap print preview',
          skin: 'lightgray',
          trusted: true,
          theme: 'modern',
          plugin_preview_width : "500",
          plugin_preview_height : "500"
        };
        /*
         Send message to widget that this page has been opened
         */
        if ($routeParams.itemId) {
          buildfire.messaging.sendMessageToWidget({
            id: $routeParams.itemId,
            type: 'OpenItem'
          });
        }

        updateMasterItem(ContentPeople.item);
        function updateMasterItem(item) {
          ContentPeople.masterItem = angular.copy(item);
        }

        function resetItem() {
          ContentPeople.item = angular.copy(ContentPeople.masterItem);
        }

        function isUnchanged(item) {
          return angular.equals(item, ContentPeople.masterItem);
        }

        function isValidItem(item) {
          return item.fName || item.lName;
        }

        /*On click button done it redirects to home*/
        ContentPeople.done = function () {
          console.log('Done called------------------------------------------------------------------------');
          Buildfire.history.pop();
          Location.goToHome();
        };

        ContentPeople.getItem = function (itemId) {
          Buildfire[window.DB_PROVIDER].getById(itemId, TAG_NAMES.PEOPLE, function (err, item) {
            if (err)
              throw console.error('There was a problem saving your data', err);
            ContentPeople.item = item;
            _data.dateCreated = item.data.dateCreated;
            _data.rank = item.data.rank;
            if(item && item.data && !item.data.deepLinkUrl) {
                ContentPeople.item.data.deepLinkUrl = Buildfire.deeplink.createLink({id: item.id});
            }
            updateMasterItem(ContentPeople.item);
            $scope.$digest();
          });
        };

        if ($routeParams.itemId) {
          ContentPeople.getItem($routeParams.itemId);
        }

        ContentPeople.addNewItem = function () {
          ContentPeople.isNewItemInserted = true;
          _rankOfLastItem = _rankOfLastItem + 10;
          ContentPeople.item.data.dateCreated = +new Date();
          ContentPeople.item.data.rank = _rankOfLastItem;

          console.log("inserting....");
          Buildfire[window.DB_PROVIDER].insert(ContentPeople.item.data, TAG_NAMES.PEOPLE, false, function (err, data) {
            console.log("Inserted", data.id);
            ContentPeople.isUpdating = false;
            if (err) {
              ContentPeople.isNewItemInserted = false;
              return console.error('There was a problem saving your data');
            }
            RankOfLastItem.setRank(_rankOfLastItem);
            ContentPeople.item.id = data.id;
            _data.dateCreated = ContentPeople.item.data.dateCreated;
            _data.rank = ContentPeople.item.data.rank;
            updateMasterItem(ContentPeople.item);
            ContentPeople.item.data.deepLinkUrl = Buildfire.deeplink.createLink({id: data.id});
            // Send message to widget as soon as a new item is created with its id as a parameter
            if (ContentPeople.item.id) {
              buildfire.messaging.sendMessageToWidget({
                id: ContentPeople.item.id,
                type: 'AddNewItem'
              });
            }
            $scope.$digest();
          });
        };

        ContentPeople.updateItemData = function () {
          Buildfire[window.DB_PROVIDER].update(ContentPeople.item.id, ContentPeople.item.data, TAG_NAMES.PEOPLE, function (err) {
            ContentPeople.isUpdating = false;
            if (err)
              return console.error('There was a problem saving your data');
          })
        };

        ContentPeople.openEditLink = function (link, index) {
          var options = {showIcons: false};
          var callback = function (error, result) {
            if (error) {
              return console.error('Error:', error);
            }
            if (result === null) {
              return console.error('Error:Can not save data, Null record found.');
            }
            ContentPeople.item.data.socialLinks = ContentPeople.item.data.socialLinks || [];
            ContentPeople.item.data.socialLinks.splice(index, 1, result);
            $scope.$digest();
          };
          Buildfire.actionItems.showDialog(link, options, callback);
        };

        ContentPeople.onUpdateFn = Buildfire[window.DB_PROVIDER].onUpdate(function (event) {
          if (event && event.status) {
            switch (event.status) {
              case STATUS_CODE.INSERTED:
                console.info('Data inserted Successfully');
                Buildfire[window.DB_PROVIDER].get(TAG_NAMES.PEOPLE_INFO, function (err, result) {
                  if (err) {
                    return console.error('There was a problem saving your data', err);
                  }
                  result.data.content.rankOfLastItem = _rankOfLastItem;
                  Buildfire[window.DB_PROVIDER].save(result.data, TAG_NAMES.PEOPLE_INFO, function (err) {
                    if (err)
                      return console.error('There was a problem saving last item rank', err);
                  });
                });
                break;
              case STATUS_CODE.UPDATED:
                console.info('Data updated Successfully');
                break;
            }
          }
        });

        var linkOptions = {"icon": "true"};
        ContentPeople.linksSortableOptions = {
          handle: '> .cursor-grab'
        };

        ContentPeople.openAddLinkPopup = function () {
          var options = {showIcons: false};
          var callback = function (error, result) {
            if (error) {
              return console.error('Error:', error);
            }
            if (!ContentPeople.item.data.socialLinks) {
              ContentPeople.item.data.socialLinks = [];
            }
            if (result === null) {
              return console.error('Error:Can not save data, Null record found.');
            }
            if(result.action == "sendSms"){
              result.body ="Hello. How are you? This is a test message."
            }
            ContentPeople.item.data.socialLinks.push(result);
            $scope.$digest();
          };
          Buildfire.actionItems.showDialog(null, linkOptions, callback);
        };

        ContentPeople.removeLink = function (_index) {
          ContentPeople.item.data.socialLinks.splice(_index, 1);
        };

        var options = {showIcons: false, multiSelection: false};
        var callback = function (error, result) {
          if (error) {
            return console.error('Error:', error);
          }
          if (result.selectedFiles && result.selectedFiles.length) {
            ContentPeople.item.data.topImage = result.selectedFiles[0];
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
        var updateItemsWithDelay = function (item) {
          clearTimeout(tmrDelayForPeoples);
          ContentPeople.isUpdating = false;
          ContentPeople.unchangedData = angular.equals(_data, ContentPeople.item.data);

          ContentPeople.isItemValid = isValidItem(ContentPeople.item.data);
          if (!ContentPeople.isUpdating && !isUnchanged(ContentPeople.item) && ContentPeople.isItemValid) {
            tmrDelayForPeoples = setTimeout(function () {
              if (item.id) {
                ContentPeople.updateItemData();
              } else if (!ContentPeople.isNewItemInserted) {
                ContentPeople.addNewItem();
              }
            }, 500);
          }
        };

        $scope.$watch(function () {
          return ContentPeople.item;
        }, updateItemsWithDelay, true);

        $scope.$on("$destroy", function () {
          console.log("^^^^^^^^^^^^^^^^^^");
          ContentPeople.onUpdateFn.clear();
        });
      }]);
})(window.angular, window.buildfire);

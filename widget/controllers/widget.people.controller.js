'use strict';

(function (angular, window) {
  angular
    .module('peoplePluginWidget')
    .controller('WidgetPeopleCtrl', ['$scope', '$window', 'Buildfire', 'TAG_NAMES', 'ERROR_CODE', "Location", '$routeParams',function ($scope, $window, Buildfire, TAG_NAMES, ERROR_CODE, Location, $routeParams) {
      var WidgetPeople = this;
      var currentItemLayout,
        currentListLayout;

      /*
       Send message to Control that this page has been opened
       */
      if($routeParams.id){
        buildfire.messaging.sendMessageToControl({id : $routeParams.id});
      }

      var itemId = $routeParams.id;
      var getPeopleDetail = function () {
        console.log("ItemID::::::::::: ", itemId);
        Buildfire.datastore.getById(itemId, TAG_NAMES.PEOPLE, function (err, result) {
          if (err && err.code !== ERROR_CODE.NOT_FOUND) {
            console.error('-----------Unable to load data-------------', err);
          }
          else {
            WidgetPeople.item = result.data;
            $scope.$digest();
          }
          bindOnUpdate();
        });
      };
      var getContentPeopleInfo = function () {
        Buildfire.datastore.get(TAG_NAMES.PEOPLE_INFO, function (err, result) {

          if (err && err.code !== ERROR_CODE.NOT_FOUND) {
            console.error('-----------err-------------', err);
          }
          else {
            console.log(result);
            WidgetPeople.data = result.data;
            if (!WidgetPeople.data.content.sortBy) {
              //WidgetPeople.data.content.sortBy = WidgetPeople.sortingOptions[0];
            }
            currentItemLayout = WidgetPeople.data.design.itemLayout;
            currentListLayout = WidgetPeople.data.design.listLayout;
            $scope.$digest();
          }
          getPeopleDetail();
        });
      };
      getContentPeopleInfo();
      function bindOnUpdate() {
       WidgetPeople.onUpdateFn = Buildfire.datastore.onUpdate(function (event) {
          if (event && event.tag) {
            switch (event.tag) {
              case TAG_NAMES.PEOPLE:
                //update the People/Item info template in emulator
                break;
              case TAG_NAMES.PEOPLE_INFO:
                if (event.obj.design.itemLayout && currentItemLayout != event.obj.design.itemLayout) {
                  WidgetPeople.data.design.itemLayout = event.obj.design.itemLayout;
                  currentItemLayout = event.obj.design.itemLayout;
                }
                else if (event.obj.design.listLayout && currentListLayout != event.obj.design.listLayout) {
                  Location.goToHome();
                }
                break;
            }
            $scope.$digest();
          }
        });
      }
      $scope.$on("$destroy", function(){
        WidgetPeople.onUpdateFn.clear();
      });
      WidgetPeople.openLinks = function(actionItems){
        if(actionItems && actionItems.length){
          var options = {};
          var callback = function (error, result) {
            if (error) {
              console.error('Error:', error);
            }
          };
          buildfire.actionItems.list(actionItems,options,callback);
        }
      }

    }])
})(window.angular, window);

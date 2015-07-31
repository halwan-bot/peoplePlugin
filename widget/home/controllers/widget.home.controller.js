'use strict';

(function (angular, window) {
  angular
    .module('peoplePluginWidget')
    .controller('WidgetHomeCtrl', ['$scope', '$window', 'Buildfire', 'TAG_NAMES', 'ERROR_CODE', "Location", function ($scope, $window, Buildfire, TAG_NAMES, ERROR_CODE, Location) {
      var WidgetHome = this;
      var currentItemLayout,
        currentListLayout,
        _pageSize = 20,
        _page = 0,
        searchOptions = {
          filter: {"$json.fName": {"$regex": '/*'}}
          , page: _page
          , pageSize: _pageSize + 1 // the plus one is to check if there are any more
        };


      var getContentItems = function (_searchOptions) {
        Buildfire.datastore.search(_searchOptions, TAG_NAMES.PEOPLE, function (err, result) {
          if (err) {
            console.error('-----------err in getting list-------------', err);
          }
          else {

            WidgetHome.items = result;
            if (result.length > _pageSize) {// to indicate there are more
              console.log('-------More Data available--------');
            }
            $scope.$digest();
          }
        });
      };
      var getContentPeopleInfo = function () {
        Buildfire.datastore.get(TAG_NAMES.PEOPLE_INFO, function (err, result) {

          if (err && err.code !== ERROR_CODE.NOT_FOUND) {
            console.error('-----------err-------------', err);
          }
          else {
            WidgetHome.data = result.data;
            if (!WidgetHome.data.content.sortBy) {
              //WidgetHome.data.content.sortBy = WidgetHome.sortingOptions[0];
            }
            currentItemLayout = WidgetHome.data.design.itemLayout;
            currentListLayout = WidgetHome.data.design.listLayout;
            $scope.$digest();
          }
          getContentItems(searchOptions);
        });
      };
      getContentPeopleInfo();

      Buildfire.datastore.onUpdate(function (event) {
        if (event && event.tag) {
          switch (event.tag) {
            case TAG_NAMES.PEOPLE:
              WidgetHome.items.push({data : event.obj});
              break;
            case TAG_NAMES.PEOPLE_INFO:
              if (event.obj.design.itemLayout && currentItemLayout != event.obj.design.itemLayout) {
                Location.goTo("#/people");
              }
              else if (event.obj.design.listLayout && currentListLayout != event.obj.design.listLayout) {
                currentListLayout = event.obj.design.listLayout;
                WidgetHome.data.design.listLayout = event.obj.design.listLayout;
              }
              else{

              }
              break;
          }
          $scope.$digest();
        }
      });


    }])
    // Directive for adding  Image carousel on widget home page
    .directive('imageCarousel', function () {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          setTimeout(function () {

            $(elem).owlCarousel({
              'items': 1,
              'slideSpeed': 300,
              'dots': true,
              'autoplay': true,
              'loop': true
            })
          }, 100);
        }
      }
    })
})(window.angular, window);

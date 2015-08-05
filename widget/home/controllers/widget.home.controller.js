'use strict';

(function (angular, window) {
  angular
    .module('peoplePluginWidget')
    .controller('WidgetHomeCtrl', ['$scope', '$window', 'Buildfire', 'TAG_NAMES', 'ERROR_CODE', "Location", function ($scope, $window, Buildfire, TAG_NAMES, ERROR_CODE, Location) {

      var MANUALLY = 'Manually',
        OLDEST_TO_NEWEST = 'Oldest to Newest',
        NEWEST_TO_OLDEST = 'Newest to Oldest',
        FIRST_NAME_A_TO_Z = 'First Name A-Z',
        FIRST_NAME_Z_TO_A = 'First Name Z-A',
        LAST_NAME_A_TO_Z = 'Last Name A-Z',
        LAST_NAME_Z_TO_A = 'Last Name Z-A',
        _pageSize = 10,
        _page = 0,
        searchOptions = {
          filter: {"$json.fName": {"$regex": '/*'}}, page: _page, pageSize: _pageSize + 1 // the plus one is to check if there are any more
        };

      var WidgetHome = this;
      WidgetHome.busy = false;
      WidgetHome.sortingOptions = [
        MANUALLY,
        OLDEST_TO_NEWEST,
        NEWEST_TO_OLDEST,
        FIRST_NAME_A_TO_Z,
        FIRST_NAME_Z_TO_A,
        LAST_NAME_A_TO_Z,
        LAST_NAME_Z_TO_A
      ];
      var currentItemLayout,
        currentListLayout,currentSortOrder;

      var getContentPeopleInfo = function () {
        Buildfire.datastore.get(TAG_NAMES.PEOPLE_INFO, function (err, result) {

          if (err && err.code !== ERROR_CODE.NOT_FOUND) {
            console.error('-----------err-------------', err);
          }
          else {
            WidgetHome.data = result.data;
            if (!WidgetHome.data.content.sortBy) {
              WidgetHome.data.content.sortBy = WidgetHome.sortingOptions[0];
            }
            currentSortOrder = WidgetHome.data.content.sortBy;
            currentItemLayout = WidgetHome.data.design.itemLayout;
            currentListLayout = WidgetHome.data.design.listLayout;
            $scope.$digest();
          }
        });
      };
      var getSearchOptions = function (value) {
        switch (value) {
          case MANUALLY:
            delete searchOptions.sort;
            break;
          case OLDEST_TO_NEWEST:
            searchOptions.sort = {"dateCreated": 1};
            break;
          case NEWEST_TO_OLDEST:
            searchOptions.sort = {"dateCreated": -1};
            break;
          case FIRST_NAME_A_TO_Z:
            searchOptions.sort = {"fName": 1};
            break;
          case FIRST_NAME_Z_TO_A:
            searchOptions.sort = {"fName": -1};
            break;
          case LAST_NAME_A_TO_Z:
            searchOptions.sort = {"lName": 1};
            break;
          case LAST_NAME_Z_TO_A:
            searchOptions.sort = {"lName": -1};
            break;
        }
        return searchOptions;
      };
      getContentPeopleInfo();

      $scope.isDefined = function (item) {
        return item.imageUrl !== undefined && item.imageUrl !== '';
      };
      WidgetHome.onUpdateFn = Buildfire.datastore.onUpdate(function (event) {
        $scope.imagesUpdated = false;
        $scope.$digest();
        var flag = false;
        if (event && event.tag) {
          switch (event.tag) {
            case TAG_NAMES.PEOPLE:
             /* if (WidgetHome.items && WidgetHome.items.length) {
                for (var i = 0; i < WidgetHome.items.length; i++) {
                  if (WidgetHome.items[i].id === event.id) {
                    flag = true;
                    if (event.obj) {
                      WidgetHome.items[i].data = event.obj;
                    } else {
                      WidgetHome.items.splice(i, 1);
                    }
                    break;
                  }
                }
                if (!flag) {
                  WidgetHome.items.push({data: event.obj, id: event.id});
                }
              }*/

              WidgetHome.loadMore();
              break;
            case TAG_NAMES.PEOPLE_INFO:
              if (event.obj.design.itemLayout && currentItemLayout != event.obj.design.itemLayout) {
                if (WidgetHome.items && WidgetHome.items.length) {
                  var id = WidgetHome.items[0].id;
                  Location.goTo("#/people/" + id);
                }
              }
              else if (event.obj.design.listLayout && currentListLayout != event.obj.design.listLayout) {
                currentListLayout = event.obj.design.listLayout;
                WidgetHome.data.design.listLayout = event.obj.design.listLayout;
              }
              if (event.obj.content) {
                WidgetHome.data.content = event.obj.content;
                $scope.imagesUpdated = true;
              } else {
                $scope.imagesUpdated = false;
              }
              if(event.obj.content.sortBy && currentSortOrder!=event.obj.content.sortBy){
                WidgetHome.data.content.sortBy = event.obj.content.sortBy;
                console.log("(((((((((((((((((((((((((((((",  WidgetHome.data.content.sortBy);
                WidgetHome.items = [];
                WidgetHome.busy = false;
                WidgetHome.loadMore();
              }
              break;
          }
          $scope.$digest();
        }
      });
      WidgetHome.loadMore = function () {
        if (WidgetHome.busy) {
          return;
        }
        WidgetHome.busy = true;

        if (WidgetHome.data && WidgetHome.data.content.sortBy) {
          searchOptions = getSearchOptions(WidgetHome.data.content.sortBy);
        }

        Buildfire.datastore.search(searchOptions, TAG_NAMES.PEOPLE, function (err, result) {
          if (err) {
            console.error('-----------err in getting list-------------', err);
          }
          else {
            console.log('Widget ----------------------------------- load More data------------called');
            console.log(result);
            if (result.length > _pageSize) {// to indicate there are more
              result.pop();
              searchOptions.page = searchOptions.page + 1;
              WidgetHome.busy = false;
            }
            WidgetHome.items = WidgetHome.items ? WidgetHome.items.concat(result) : result;
            $scope.$digest();
          }
        });
      };

      $scope.$on("$destroy", function () {
        WidgetHome.onUpdateFn.clear();
      });

    }])
    // Directive for adding  Image carousel on widget home page
    .directive('imageCarousel', function () {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          scope.carousel = null;
          scope.isCarouselInitiated = false;
          function initCarousel() {
            scope.carousel = null;
            setTimeout(function () {
              var obj = {
                'items': 1,
                'slideSpeed': 300,
                'dots': true,
                'autoplay': true
              };

              var totalImages = parseInt(attrs.imageCarousel, 10);
              if (totalImages) {
                if (totalImages > 1) {
                  obj['loop'] = true;
                }
                scope.carousel = $(elem).owlCarousel(obj);
                scope.isCarouselInitiated = true;
              }
              scope.$apply();
            }, 100);
          }

          initCarousel();

          scope.$watch("imagesUpdated", function (newVal, oldVal) {
            if (newVal) {
              if (scope.isCarouselInitiated) {
                scope.carousel.trigger("destroy.owl.carousel");
                scope.isCarouselInitiated = false;
              }
              $(elem).find(".owl-stage-outer").remove();
              initCarousel();
            }
          });
        }
      }
    })
})(window.angular, window);

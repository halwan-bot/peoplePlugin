(function (angular) {
    angular
        .module('peoplePluginDesign')
        .controller('DesignHomeCtrl', ['$scope', 'Buildfire', 'TAG_NAMES', function ($scope, Buildfire, TAG_NAMES) {
            var DesignHome = this;
            var DesignHomeMaster;
            DesignHome.layouts = {
                listLayouts: [{
                    name: "list-layout-1"
                }, {
                    name: "list-layout-2"
                }],
                itemLayouts: [{
                    name: "item-layout-1"
                }, {
                    name: "item-layout-2"
                }, {
                    name: "item-layout-3"
                }, {
                    name: "item-layout-4"
                }]
            };
            var options = {showIcons: false, multiSelection: false};
            DesignHome.changeListLayout = function (layoutName) {
                if (layoutName && DesignHome.peopleInfo.design) {
                    DesignHome.peopleInfo.design.listLayout = layoutName;
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                }
            };
            DesignHome.changeItemLayout = function (layoutName) {
                if (layoutName && DesignHome.peopleInfo.design) {
                    DesignHome.peopleInfo.design.itemLayout = layoutName;
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                }
            };


            function init() {
                var peopleInfo = {
                    design: {
                        listLayout: "",
                        itemLayout: "",
                        backgroundImage: ""
                    },
                    content: {
                        images: [],
                        description: ""
                    }
                };
                Buildfire.datastore.get(TAG_NAMES.PEOPLE_INFO, function (err, data) {
                    if (err) {
                        Console.log('------------Error in Design of People Plugin------------', err);
                    }
                    else if (data && data.data) {
                        DesignHome.peopleInfo = angular.copy(data.data);
                        if (!DesignHome.peopleInfo.design)
                            DesignHome.peopleInfo.design = {};
                        if (!DesignHome.peopleInfo.design.listLayout)
                            DesignHome.peopleInfo.design.listLayout = DesignHome.layouts.listLayouts[0].name;
                        if (!DesignHome.peopleInfo.design.itemLayout)
                            DesignHome.peopleInfo.design.itemLayout = DesignHome.layouts.itemLayouts[0].name;

                        DesignHomeMaster = angular.copy(data.data);
                        if (DesignHome.peopleInfo.design.backgroundImage) {
                            background.loadbackground(DesignHome.peopleInfo.design.backgroundImage);
                        }
                        $scope.$digest();
                    }
                    else {
                        DesignHome.peopleInfo = peopleInfo;
                        console.info('------------------unable to load data---------------');
                    }
                });
            }
            var background = new Buildfire.components.images.thumbnail("#background");

            background.onChange = function (url) {
                DesignHome.peopleInfo.design.backgroundImage = url;
                if (!$scope.$$phase && !$scope.$root.$$phase) {
                    $scope.$apply();
                }
            };

            background.onDelete = function (url) {
                DesignHome.peopleInfo.design.backgroundImage = "";
                if (!$scope.$$phase && !$scope.$root.$$phase) {
                    $scope.$apply();
                }
            };
            init();
            $scope.$watch(function () {
                return DesignHome.peopleInfo;
            }, function (newObj) {
                if (newObj)
                    Buildfire.datastore.save(DesignHome.peopleInfo, TAG_NAMES.PEOPLE_INFO, function (err, data) {
                        if (err) {
                            console.log("hello error")
                            return DesignHome.peopleInfo = angular.copy(DesignHomeMaster);
                        }
                        else if (data && data.obj) {

                            console.log("hello data")
                            return DesignHomeMaster = data.obj;
                        }
                        $scope.$digest();
                    });
            }, true);

        }]);
})(window.angular);
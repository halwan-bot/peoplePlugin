describe('Unit : peoplePluginDesign design.home.controller.js', function () {
    var $scope, DesignHome, $rootScope, q, $controller, buildfire, TAG_NAMES;
    beforeEach(module('peoplePluginDesign'));

    beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _Buildfire_, _TAG_NAMES_) {
        $rootScope = _$rootScope_;
        q = _$q_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        buildfire = {
            components: {
                images: {
                    thumbnail: function () {

                    }
                }
            },
        datastore:{
            get:function(){},
            save: function() {}
        }};
        TAG_NAMES = _TAG_NAMES_;
    }));

    beforeEach(function () {

        inject(function ($injector, $q) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            DesignHome = $injector.get('$controller')('DesignHomeCtrl', {
                $scope: $scope,
                TAG_NAMES: TAG_NAMES,
                Buildfire: buildfire
                /*data: {
                 design: {
                 listLayout: "",
                 itemLayout: "",
                 backgroundImage: ""
                 },
                 content: {
                 images: [],
                 description: ""
                 }
                 },
                 Buildfire: {
                 components: {
                 images: {
                 thumbnail: function () {

                 }
                 }
                 }
                 }*/
            });
            q = $q;
        });
    });
    it('Design Home Controller should be defined', function () {
        expect(DesignHome).toBeDefined();
    });
    it('should change the value of list layout when called for list', function () {
        DesignHome.peopleInfo={design: {
            listLayout: "",
            itemLayout: "",
            backgroundImage: ""
        },
            content: {
                images: [],
                description: ""
            }};
        DesignHome.changeListLayout('list-layout-1');
        $rootScope.$apply();
        expect(DesignHome.peopleInfo.design.listLayout).toEqual('list-layout-1');
    });
    it('should change the value of item layout when called for item', function () {
        DesignHome.peopleInfo={design: {
            listLayout: "",
            itemLayout: "",
            backgroundImage: ""
        },
            content: {
                images: [],
                description: ""
            }};
        DesignHome.changeItemLayout('item-layout-1');
        $rootScope.$apply();
        expect(DesignHome.peopleInfo.design.itemLayout).toEqual('item-layout-1');
    });
});
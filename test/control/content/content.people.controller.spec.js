describe('Unit : people Plugin content.people.controller.js', function () {
    var ContentPeople, $scope, $rootScope, $controller, $routeParams, TAG_NAMES, Buildfire, STATUS_CODE, RankOfLastItem, $modal, Location;
    beforeEach(module('peoplePluginContent'));
    var editor;
    beforeEach(inject(function (_$rootScope_, _$controller_, _$routeParams_, _Buildfire_, _TAG_NAMES_, _STATUS_CODE_, _Location_, _RankOfLastItem_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        TAG_NAMES = _TAG_NAMES_;
        STATUS_CODE = _STATUS_CODE_;
        Location = _Location_;
        $routeParams = _$routeParams_;
        Buildfire = {
            spinner: {
                show: function () {
                    return true
                },
                hide: function () {
                    return true
                }
            },
            components: {
                carousel: {
                    editor: {}
                }
            },
            datastore: {}
        };
        Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['search', 'onUpdate']);
        Buildfire.components.carousel = jasmine.createSpyObj('Buildfire.components.carousel', ['editor']);
        RankOfLastItem = _RankOfLastItem_;
        Buildfire.components.carousel.editor.and.callFake(function () {
            return {
                loadItems: function () {
                    console.log("egitor.loadItems hasbeen called");
                }
            };
        });
        $modal = {};
        $modal = jasmine.createSpyObj('$modal', ['open']);
    }));

    beforeEach(function () {
        ContentPeople = $controller('ContentPeopleCtrl', {
            $scope: $scope,
            $routeParams: $routeParams,
            Buildfire: Buildfire,
            RankOfLastItem: RankOfLastItem,
            TAG_NAMES: TAG_NAMES,
            STATUS_CODE: STATUS_CODE,
            Location: Location,
            $modal: $modal
        });
    });

    describe('Units: units should be Defined', function () {
        it('Buildfire should be defined and be an object', function () {
            expect(Buildfire).toBeDefined();
            expect(typeof Buildfire).toEqual('object');
        });
        it('TAG_NAMES should be defined and be an object', function () {
            expect(TAG_NAMES).toBeDefined();
            expect(typeof TAG_NAMES).toEqual('object');
        });
        it('ERROR_CODE should be defined and be an object', function () {
            expect(STATUS_CODE).toBeDefined();
            expect(typeof STATUS_CODE).toEqual('object');
        });
        it('Location should be defined and be an object', function () {
            expect(Location).toBeDefined();
            expect(typeof Location).toEqual('object');
        });
    });
});
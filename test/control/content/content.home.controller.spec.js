describe('Unit : people Plugin content.home.controller.js', function () {
    var ContentHome, $scope, $rootScope, $controller, $modal, SORT, TAG_NAMES, Buildfire, ERROR_CODE, Location, $sce, $location, $timeout, RankOfLastItem, q;
    beforeEach(module('peoplePluginContent'));
    var editor;
    beforeEach(inject(function (_$rootScope_, _$controller_, _SORT_, _TAG_NAMES_, _ERROR_CODE_, _Location_, _RankOfLastItem_, _$sce_, _$timeout_, _$q_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        SORT = _SORT_;
        TAG_NAMES = _TAG_NAMES_;
        ERROR_CODE = _ERROR_CODE_;
        Location = _Location_;
        $sce = _$sce_;
        q= _$q_;
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
        Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['search']);
        Buildfire.components.carousel = jasmine.createSpyObj('Buildfire.components.carousel', ['editor']);
        RankOfLastItem = _RankOfLastItem_;
        Buildfire.components.carousel.editor.and.callFake(function () {
            return {
                loadItems: function () {
                    console.log("egitor.loadItems hasbeen called");
                }
            };
        });
        $modal = jasmine.createSpyObj('$modal', ['open']);
               $timeout = _$timeout_;
    }));

    beforeEach(function () {
        ContentHome = $controller('ContentHomeCtrl', {
            $scope: $scope,
            Buildfire: Buildfire,
            FormatConverter: {},
            RankOfLastItem: RankOfLastItem,
            SORT: SORT,
            TAG_NAMES: TAG_NAMES,
            ERROR_CODE: ERROR_CODE,
            Location: Location,
            $sce: $sce,
            $modal: $modal,
            $timeout: $timeout,
            PeopleInfo: {
                data: {
                    content: {
                        images: []
                    }
                }
            }
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
            expect(ERROR_CODE).toBeDefined();
            expect(typeof ERROR_CODE).toEqual('object');
        });
        it('Location should be defined and be an object', function () {
            expect(Location).toBeDefined();
            expect(typeof Location).toEqual('object');
        });
        it('$sce should be defined and be an object', function () {
            expect($sce).toBeDefined();
            expect(typeof $sce).toEqual('object');
        });
    });

    describe('ContentHome.exportCSV', function () {
        it('Should be defined and be a function', function () {
            ContentHome.exportCSV();
            expect(ContentHome.exportCSV).toBeDefined();
            expect(typeof ContentHome.exportCSV).toEqual('function');
        });
    });

    describe('ContentHome.safeHtml', function () {
        it('Should be defined and be a function', function () {
            expect(ContentHome.safeHtml).toBeDefined();
            expect(typeof ContentHome.safeHtml).toEqual('function');
        });
        it('ContentHome.safeHtml', function () {
            var result = '';
            result = ContentHome.safeHtml('<p>hello</p>');
            expect(result).not.toEqual('');
        });
    });

    describe('ContentHome.loadMore', function () {
        it('Should be defined and be a function', function () {
            expect(ContentHome.loadMore).toBeDefined();
            expect(typeof ContentHome.loadMore).toEqual('function');
        });
        it('ContentHome.loadMore with busy value as true', function () {
            ContentHome.busy = true;
            ContentHome.loadMore('hello');
//            expect(result).not.toEqual('');
        });
        it('ContentHome.loadMore with busy value as false', function () {
            var sortByValues = ['Oldest to Newest', 'Newest to Oldest', 'First Name A-Z', 'First Name Z-A', 'Last Name A-Z', 'Last Name Z-A'];
            ContentHome.busy = false;
            ContentHome.searchOptions = {sort: {}};
            sortByValues.forEach(function (value) {
                ContentHome.data = {content: {sortBy: value}};
                ContentHome.loadMore(false);
                ContentHome.busy = false;
            });
            /*Buildfire.datastore.search.and.callFake(function () {

            });*/
//            $rootScope.$digest();
        });
    });

    describe('ContentHome.openImportCSVDialog ', function () {
        it('Should be defined and be a function', function () {
            expect(ContentHome.openImportCSVDialog ).toBeDefined();
            expect(typeof ContentHome.openImportCSVDialog ).toEqual('function');
        });
        it('ContentHome.openImportCSVDialog ', function () {

            $modal.open.and.callFake(function () {
                var defer = q.defer();
                defer.resolve([{}]);
                return ({
                    result:defer.promise
                });
            });

            ContentHome.openImportCSVDialog();
            $rootScope.$digest();
//            expect(result).not.toEqual('');
        });
    });

    describe('ContentHome.itemSortableOptions.stop', function () {
        it('Should be defined and be a function', function () {
            expect(ContentHome.itemSortableOptions.stop).toBeDefined();
            expect(typeof ContentHome.itemSortableOptions.stop).toEqual('function');
        });
        it('ContentHome.itemSortableOptions.stop', function () {
            var e = {},
                ui = {
                item: {
                    sortable: {
                        dropIndex: 1
                    }
                }};
            ContentHome.items = [];
            ContentHome.itemSortableOptions.stop(e,ui);
//            expect(result).not.toEqual('');
        });
    });

    xdescribe('$destroy', function () {
        it('should invoke when get $destroy', function () {
            //   $rootScope.$broadcast('$destroy');
        });
    });

});
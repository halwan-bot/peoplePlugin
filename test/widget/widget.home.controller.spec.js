describe('Unit : people Plugin widget.home.controller.js success of PeopleInfo.get inside init', function () {
    var WidgetHome,
        scope,
        $rootScope,
        $controller,
        Buildfire,
        q,
        TAG_NAMES,
        ERROR_CODE,
        Location,
        $sce,
        COLLECTIONS,
        DB;

    beforeEach(module('peoplePluginWidget', function ($provide) {
        $provide.service('Buildfire', function () {
            this.datastore = jasmine.createSpyObj('datastore', ['get', 'onUpdate']);
            this.datastore.get.and.callFake(function (_tagName, callback) {
                if (_tagName) {
                    callback(null, {data: {
                        design: {
                            backgroundImage: '',
                            itemLayout: '',
                            listLayout: ''
                        },
                        content: {
                            sortBy: 'Newest'
                        }
                    }});
                } else {
                    callback('Error', null);
                }
            });
            this.datastore.onUpdate.and.callFake(function (callback) {
                callback('Event');
                return {
                    clear: function () {
                        return true
                    }
                }
            });
        });
    }));
    beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _TAG_NAMES_, _ERROR_CODE_, _Location_, _Buildfire_, _COLLECTIONS_, _$sce_, _DB_) {
        scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        Buildfire = _Buildfire_;
        Buildfire.deeplink = {};
        q = _$q_;
        TAG_NAMES = _TAG_NAMES_;
        ERROR_CODE = _ERROR_CODE_;
        Location = jasmine.createSpyObj('Location', ['goTo']);
        Buildfire.deeplink = jasmine.createSpyObj('Buildfire.deeplink', ['getData']);
        $sce = _$sce_;
        DB = _DB_;
        COLLECTIONS = _COLLECTIONS_;
    }));

    beforeEach(function () {
        WidgetHome = $controller('WidgetHomeCtrl', {
            $scope: scope,
            $q: q,
            Buildfire: Buildfire,
            TAG_NAMES: TAG_NAMES,
            ERROR_CODE: ERROR_CODE,
            Location: Location,
            $sce: $sce,
            $rootScope: $rootScope,
            DB: DB,
            COLLECTIONS: COLLECTIONS
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

    describe('UNIT: Init', function () {
        describe('When success of People info get', function () {
            it('it should resolve and return data', function () {
                $rootScope.$digest();
                expect(WidgetHome.data.content.sortBy).toEqual('Newest');
            })
        });
    });


    describe('WidgetHome.showDescription', function () {

        it('should pass if it returns true when description is not the default html', function () {
            var description = 'a';
            var result = WidgetHome.showDescription(description);
            expect(result).toEqual(true);
        });

        it('should pass if it returns true when description is not the default html', function () {
            var description = '<p>&nbsp;<br></p>';
            var result = WidgetHome.showDescription(description);
            expect(result).not.toEqual(true);
        });
    });

    describe('WidgetHome.getPeopleDetails', function () {

        it('should pass if it returns true when description is not the default html', function () {
            var peopleId = 'b3458999a';
            WidgetHome.getPeopleDetails(peopleId);
        });
    });

});
describe('Unit : people Plugin widget.home.controller.js error of PeopleInfo.get inside init', function () {
    var WidgetHome,
        scope,
        $rootScope,
        $controller,
        Buildfire,
        q,
        TAG_NAMES,
        ERROR_CODE,
        Location,
        $sce,
        COLLECTIONS,
        DB;

    beforeEach(module('peoplePluginWidget', function ($provide) {
        $provide.service('Buildfire', function () {
            this.datastore = jasmine.createSpyObj('datastore', ['get', 'onUpdate']);
            this.datastore.get.and.callFake(function (_tagName, callback) {
                callback('Error', null);

            });
            this.datastore.onUpdate.and.callFake(function (callback) {
                callback('Event');
                return {
                    clear: function () {
                        return true
                    }
                }
            });
        });
    }));
    beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _TAG_NAMES_, _ERROR_CODE_, _Location_, _Buildfire_, _COLLECTIONS_, _$sce_, _DB_) {
        scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        Buildfire = _Buildfire_;
        Buildfire.deeplink = {};
        q = _$q_;
        TAG_NAMES = _TAG_NAMES_;
        ERROR_CODE = _ERROR_CODE_;
        Location = jasmine.createSpyObj('Location', ['goTo']);
        Buildfire.deeplink = jasmine.createSpyObj('Buildfire.deeplink', ['getData']);
        $sce = _$sce_;
        DB = _DB_;
        COLLECTIONS = _COLLECTIONS_;
    }));

    beforeEach(function () {
        WidgetHome = $controller('WidgetHomeCtrl', {
            $scope: scope,
            $q: q,
            Buildfire: Buildfire,
            TAG_NAMES: TAG_NAMES,
            ERROR_CODE: ERROR_CODE,
            Location: Location,
            $sce: $sce,
            $rootScope: $rootScope,
            DB: DB,
            COLLECTIONS: COLLECTIONS
        });
    });

    describe('UNIT: Init', function () {
        describe('When Error', function () {
            it('it should reject and return error', function () {
                $rootScope.$digest();
            })
        });
    });
});

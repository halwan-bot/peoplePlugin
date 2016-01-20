describe('Unit: peoplePluginWidget: Services', function () {
    beforeEach(module('peoplePluginWidget'));


    describe('Unit : Buildfire service', function () {
        var Buildfire;
        beforeEach(inject(
            function (_buildfire_) {
                Buildfire = _buildfire_;
            }));
    });

    describe('Unit : DataStore Factory', function () {
        var DataStore, Buildfire, STATUS_MESSAGES, STATUS_CODE, q;
        beforeEach(module('peoplePluginWidget'));
        Buildfire = {
            datastore: {}
        };
        Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['get', 'getById', 'bulkInsert', 'insert', 'search', 'update', 'save', 'delete']);
        beforeEach(inject(function (_DataStore_, _STATUS_CODE_, _STATUS_MESSAGES_) {
            DataStore = _DataStore_;
            STATUS_CODE = _STATUS_CODE_;
            STATUS_MESSAGES = _STATUS_MESSAGES_;
        }));
    });
    describe('Unit : People service', function () {
        var DB, People, Buildfire,$rootScope;
        beforeEach(inject(
            function (_DB_,_$rootScope_) {
                DB = _DB_;
                People = new DB('People');
                $rootScope=_$rootScope_;
            }));
        beforeEach(inject(function () {
            Buildfire = {
                datastore: {}
            };
            Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['get', 'getById', 'bulkInsert', 'insert', 'search', 'update', 'save', 'delete']);
        }));

        it('People should exists', function () {
            expect(People).toBeDefined();
            expect(People._tagName).toEqual('People');
        });
        it('People methods should exists', function () {
            expect(People.get).toBeDefined();
            expect(People.find).toBeDefined();
            expect(People.save).toBeDefined();
            expect(People.update).toBeDefined();
            expect(People.delete).toBeDefined();
            expect(People.insert).toBeDefined();
        });
        describe('Get method:', function () {
            it('People.get methods should call Buildfire.datastore.get', function () {
                Buildfire.datastore.get.and.callFake(function (tagName, cb) {
                    cb(null, {});
                });
                People.get();
            });
            it('People.get methods should call Buildfire.datastore.get Error Case', function () {
                Buildfire.datastore.get.and.callFake(function (tagName, cb) {
                    cb({code: 'No result found'}, null);
                });
                People.get();
            });

        });
        describe('getById method:', function () {
            it('People.getById methods should call Buildfire.datastore.getById', function () {
                Buildfire.datastore.getById.and.callFake(function (id, tagName, cb) {
                    cb(null, {data: {}});
                });
                People.getById('id1');
            });
            it('People.getById methods should call Buildfire.datastore.getById Error Case', function () {
                Buildfire.datastore.getById.and.callFake(function (id, tagName, cb) {
                    cb({}, null);
                });
                People.getById('id1');
                People.getById();
            });
        });
        describe('insert method:', function () {
            it('People.insert methods should call Buildfire.datastore.insert', function () {
                Buildfire.datastore.insert.and.callFake(function (item, tagName, cb) {
                    cb(null, {data: {}});
                });
                Buildfire.datastore.bulkInsert.and.callFake(function (items, tagName, cb) {
                    cb(null, [{}]);
                });
                People.insert([]);
                People.insert('asads');
                People.insert();
                $rootScope.$apply();
            });
            it('People.insert methods should call Buildfire.datastore.insert Error Case', function () {
                Buildfire.datastore.insert.and.callFake(function (item, tagName, cb) {
                    cb({}, null);
                });
                Buildfire.datastore.bulkInsert.and.callFake(function (item, tagName, cb) {
                    cb({}, null);
                });
                People.insert([]);
                People.insert('asads');
                People.insert();
            });
        });
        describe('find method:', function () {
            it('People.find methods should call Buildfire.datastore.search', function () {
                Buildfire.datastore.search.and.callFake(function (options, tagName, cb) {
                    cb(null, {});
                });
                People.find();
                People.find({});
            });
            it('People.find methods should call Buildfire.datastore.search Error Case', function () {
                Buildfire.datastore.search.and.callFake(function (options, tagName, cb) {
                    cb({}, null);
                });
                People.find();
                People.find({});
            });
        });
        describe('update method:', function () {
            it('People.update methods should call Buildfire.datastore.update', function () {
                Buildfire.datastore.update.and.callFake(function (tagName, cb) {
                    cb(null, {});
                });
                People.update('id', {});
                People.update();
                People.update('id');
            });
            it('People.update methods should call Buildfire.datastore.update Error Case', function () {
                Buildfire.datastore.update.and.callFake(function (id, data, tagName, cb) {
                    cb({}, null);
                });
                People.update('id', {});
                People.update();
                People.update('id');
            });
        });
        describe('save method:', function () {
            it('People.save methods should call Buildfire.datastore.save', function () {
                Buildfire.datastore.save.and.callFake(function (tagName, cb) {
                    cb(null, {});
                });
                People.save({});
                People.save();
            });
            it('People.save methods should call Buildfire.datastore.save Error case', function () {
                Buildfire.datastore.save.and.callFake(function (tagName, cb) {
                    cb({}, null);
                });
                People.save({});
                People.save();
            });
        });
        describe('delete method:', function () {
            it('People.delete methods should call Buildfire.datastore.delete', function () {
                Buildfire.datastore.delete.and.callFake(function (tagName, cb) {
                    cb(null, {});
                });
                People.delete();
                People.delete('id');
            });
            it('People.delete methods should call Buildfire.datastore.delete Error Case', function () {
                Buildfire.datastore.delete.and.callFake(function (tagName, cb) {
                    cb({}, null);
                });
                People.delete();
                People.delete('id');
            });
        });
        describe('clearListener method:', function () {
            it('People.clearListener methods call', function () {
                People.clearListener();
            });
        });

    });

});
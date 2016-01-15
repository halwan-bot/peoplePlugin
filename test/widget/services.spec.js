describe('Unit: peopleServices: Services', function () {
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
    beforeEach(inject(function (_DataStore_, _STATUS_CODE_, _STATUS_MESSAGES_) {
      DataStore = _DataStore_;
      STATUS_CODE = _STATUS_CODE_;
      STATUS_MESSAGES = _STATUS_MESSAGES_;
      Buildfire = {
        datastore: {}
      };
    }));
  });
  describe('Unit : People service', function () {
    var DB, People;
    beforeEach(inject(
        function (_DB_) {
          DB = _DB_;
          People = new DB('People');
        }));
    it('MediaContent should exists', function () {
      expect(People).toBeDefined();
      expect(People._tagName).toEqual('People');
    });
    it('MediaCenter methods should exists', function () {
      expect(People.get).toBeDefined();
      expect(People.find).toBeDefined();
      expect(People.save).toBeDefined();
      expect(People.update).toBeDefined();
      expect(People.delete).toBeDefined();
      expect(People.insert).toBeDefined();
    });
    it('MediaCenter methods should exists', function () {
      Buildfire={datastore:{get:function(tagName,cb){
        cb(null,{});
      }}};
      People.insert([]);
      People.insert('asads');
      People.getById('id1');
      People.insert();
      People.find();
      People.find({});
      People.update('id',{});
      People.update();
      People.update('id');
      People.save({});
      People.save();
      People.delete();
      People.delete('id');
      People.clearListener();
    });
  });

});
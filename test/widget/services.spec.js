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
  })

});
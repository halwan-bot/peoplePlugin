describe('Unit: peopleServices: Services', function () {
    beforeEach(module('peoplePluginContent'));


  describe('Unit : Buildfire service', function () {
    var Buildfire;
    beforeEach(inject(
        function (_buildfire_) {
          Buildfire = _buildfire_;
        }));
  });

  describe('Unit : DB Factory', function () {
    var DB, Buildfire, MESSAGES, CODE, $q;
    beforeEach(module('peoplePluginContent'));
    beforeEach(inject(function (_DB_, _CODE_, _MESSAGES_, _$q_) {
      DB = _DB_;
      CODE = _CODE_;
      MESSAGES = _MESSAGES_;
      $q= _$q_;
      Buildfire = {};
    }));
  })
});
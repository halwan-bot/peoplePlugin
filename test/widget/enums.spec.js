describe('Unit : peopleEnums widget Enums', function () {
  var CODES, MESSAGES, EVENTS, LAYOUTS, COLLECTIONS, PATHS;
  beforeEach(module('peopleEnums'));

  beforeEach(inject(function (_CODES_, _MESSAGES_, _EVENTS_, _COLLECTIONS_, _PATHS_) {
    CODES = _CODES_;
    MESSAGES = _MESSAGES_;
    EVENTS = _EVENTS_;
    COLLECTIONS = _COLLECTIONS_;
    PATHS = _PATHS_;
  }));

  describe('Enum : CODES', function () {
    it('CODES should exist and be an object', function () {
      expect(typeof CODES).toEqual('object');
    });

    it('CODES.NOT_FOUND should exist and equals to NOTFOUND', function () {
      expect(CODES.NOT_FOUND).toEqual("NOTFOUND");
    });

    it('CODES.SUCCESS should exist and equals to SUCCESS', function () {
      expect(CODES.SUCCESS).toEqual("SUCCESS");
    });
  });

});

describe('Unit : peoplePluginContent content Enums', function () {
  var CODES, MESSAGES, EVENTS, COLLECTIONS, PATHS;
  var messages = {
    NOT_FOUND: "No result found",
    CALLBACK_NOT_DEFINED: "Callback is not defined",
    ID_NOT_DEFINED: "Id is not defined",
    DATA_NOT_DEFINED: "Data is not defined",
    OPTION_REQUIRES: "Requires options"
  };

  beforeEach(module('peoplePluginContent'));

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

  describe('Enum : MESSAGES', function () {
    it('MESSAGES should exist and be an object', function () {
      expect(typeof MESSAGES).toEqual('object');
    });
    it('MESSAGES.ERROR should exist and equals to an array of messages', function () {
      expect(MESSAGES.ERROR).toEqual(messages);
    });
  });

  describe('Enum : EVENTS', function () {
    it('EVENTS should exist and be an object', function () {
      expect(typeof EVENTS).toEqual('object');
    });
  });

  describe('Enum : COLLECTIONS', function () {
    it('COLLECTIONS should exist and be an object', function () {
      expect(typeof COLLECTIONS).toEqual('object');
    });
  });

  describe('Enum : PATHS', function () {
    it('PATHS should exist and be an object', function () {
      expect(typeof PATHS).toEqual('object');
    });
  });

});

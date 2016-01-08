
describe('Unit: resizeImage filter', function () {
    beforeEach(module('peopleFiltersContent'));
    var filter;
    beforeEach(inject(function (_$filter_) {
        filter = _$filter_;
    }));

    it('it should pass if "resizeImage" filter returns resized image url', function () {
        var result;
        result = filter('resizeImage')('https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg', 88, 124, 'resize');
        expect(result).toEqual("http://s7obnu.cloudimage.io/s/resizenp/88x124/https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg");
    });

    it('it should give a default image even if parameter is blank', function () {
        var result;
        result = filter('resizeImage')('', 88, 124, 'resize');
        expect(result).toEqual("http://s7obnu.cloudimage.io/s/resizenp/88x124/");
    });
});
describe('Unit: cropImage filter', function () {
    beforeEach(module('peopleFiltersContent'));
    var filter;
    beforeEach(inject(function (_$filter_) {
        filter = _$filter_;
    }));

    it('it should pass if "cropImage" filter returns cropped image url', function () {
        var result;
        result = filter('cropImage')('https://www.facebook.com/photo.php?fbid=1008284442533844&set=a.359021657460129.98766.100000568920267&type=1&theater', 88, 124);
        expect(result).toEqual("http://s7obnu.cloudimage.io/s/crop/88x124/https://www.facebook.com/photo.php?fbid=1008284442533844&set=a.359021657460129.98766.100000568920267&type=1&theater");
    });

    it('it should give a default image even if parameter is blank', function () {
        var result;
        result = filter('cropImage')('', 88, 124);
        expect(result).toEqual("http://s7obnu.cloudimage.io/s/crop/88x124/");
    });
});

describe('Unit: truncate filter', function () {
    beforeEach(module('peopleFiltersContent'));
    var filter;
    beforeEach(inject(function (_$filter_) {
        filter = _$filter_;
    }));

    it('it should pass if "truncate" filter returns truncated text', function () {
        var result;
        result = filter('truncate')('Hello World', 5, 5);
        expect(result).toEqual('5');
    });

    it('it should be called when length is given as NaN', function () {
        var result;
        result = filter('truncate')('Hello World', 'abc', 5);
        expect(result).toEqual("5");
    });

    it('it should be called when end is undefined', function () {
        var result;
        result = filter('truncate')('Hello World', 5);
        expect(result).toEqual("He...");
    });

    it('it should be called when text length is less than given length in parameter', function () {
        var result;
        result = filter('truncate')('Hello', 9, 7);
        expect(result).toEqual("Hello");
    });
});

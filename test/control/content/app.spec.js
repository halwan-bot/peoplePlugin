describe('Unit: peoplePluginContent content app', function () {
    describe('Unit: app routes', function () {
        beforeEach(module('peoplePluginContent'));
        var location, route, rootScope;
        beforeEach(inject(function (_$location_, _$route_, _$rootScope_) {
            location = _$location_;
            route = _$route_;
            rootScope = _$rootScope_;

        }));

        describe('Home route', function () {
            beforeEach(inject(
                function ($httpBackend) {
                    $httpBackend.expectGET('templates/home.html')
                        .respond(200);
                    $httpBackend.expectGET('/')
                        .respond(200);
                }));
        });

        describe('Create people route', function () {
            beforeEach(inject(
                function ($httpBackend) {
                    $httpBackend.expectGET('templates/people.html')
                        .respond(200);
                    $httpBackend.expectGET('/people')
                        .respond(200);
                }));
        });

        describe('Edit people route', function () {
            beforeEach(inject(
                function ($httpBackend) {
                    $httpBackend.expectGET('templates/people.html')
                        .respond(200);
                    $httpBackend.expectGET('/people/:id')
                        .respond(200);
                }));
        });
    });


    describe('Unit: getImageUrl filter', function () {
        beforeEach(module('peoplePluginContent'));
        var filter;
        beforeEach(inject(function (_$filter_) {
            filter = _$filter_;
        }));

        it('it should pass if "getImageUrl" filter returns resized image url', function () {
            var result;
            result = filter('getImageUrl')('https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg', 88, 124, 'resize');
            expect(result).toEqual("http://s7obnu.cloudimage.io/s/resizenp/88x124/https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg");
        });
        it('it should pass if "getImageUrl" filter returns cropped image url', function () {
            var result;
            result = filter('getImageUrl')('https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg', 88, 124, 'crop');
            expect(result).toEqual('http://s7obnu.cloudimage.io/s/crop/88x124/https://imagelibserver.s3.amazonaws.com/25935164-2add-11e5-9d04-02f7ca55c361/950a50c0-400a-11e5-9af5-3f5e0d725ccb.jpg');
        });
    });


    describe('Unit: fileReader Directive', function () {
        var fileData = $;
        var $rootScope, $scope, $compile, el,
            $body = $('body'), windowMock, eventListener,
            simpleHtml;


        beforeEach(function () {
            module('peoplePluginContent');

            inject(function ($injector) {
                $rootScope = $injector.get('$rootScope');
                windowMock = $injector.get('$window');
                $scope = $rootScope.$new();
                $scope.fileData = [
                    {name:'file.txt',size:4564546}
                ];
                simpleHtml = '<input type="file" name="file" file-reader="fileData" />';
                //$scope.images = [];
                $compile = $injector.get('$compile');
                el = $compile(angular.element(simpleHtml))($scope);
            });

            $body.append(el);
            $rootScope.$apply();
            eventListener = jasmine.createSpy();
            spyOn(windowMock, "FileReader").and.returnValue({
                addEventListener: eventListener,
                readAsText: function (file) {
                    // do nothing.
                }
            });
        });

        it('should read content from a file', function () {
            var div = el[0];
            var files = { 0: {name:'foo.txt', size: 500001} };
            /*div.triggerHandler({
                type: 'change',
                target: {
                    files: files
                }
            });*/
            div.dispatchEvent(new CustomEvent('change', {
                type: 'change',
                target: {
                    files: files
                }
            }));
//            expect(windowMock.FileReader).toHaveBeenCalled();
        });

    });



    xdescribe('Location', function () {
        // Load your module.
        var mockObj, Location, $rootScope;
        beforeEach(module('peoplePluginContent'), function($provide) {
            Location={goTo:function(){},
               goToHome:function(){}
            };
            /*Location = jasmine.createSpyObj('Location', ['goTo', 'goToHome']);
            Location.goTo.and.callFake(function (path) {
                window.location.href = path;
            });
            Location.goToHome.and.callFake(function () {
                window.location.href = window.location.href.substr(0, window.location.href.indexOf('#'));
            })*/

        });
        beforeEach(inject, function (_$rootScope_) {
            $rootScope = _$rootScope_;
        });
        it('factory location methods calling', function () {
//            Location.goToHome();
            Location.goTo();
            $rootScope.$digest();
        });

    });

});

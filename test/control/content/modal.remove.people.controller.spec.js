describe('Unit : peoplePluginContent content people remove modal', function () {
    var RemovePeoplePopup, scope, $rootScope, $controller,modalInstance;
    beforeEach(module('peoplePluginContent'));
    beforeEach(inject(function (_$rootScope_, _$controller_) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $controller = _$controller_;
        modalInstance = { // Create a mock object using spies
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };
    }));

    beforeEach(function () {
        RemovePeoplePopup = $controller('RemovePeoplePopupCtrl', {
            $scope: scope,
            $modalInstance:modalInstance,
            peopleInfo: {}
        });
    });

    describe('It will test the defined methods', function () {
        it('it should pass if RemovePeoplePopup is defined', function () {
            expect(RemovePeoplePopup).not.toBeUndefined();
        });
        it('RemovePeoplePopupCtrl.cancel should close modalInstance', function () {
            RemovePeoplePopup.cancel();
            expect(modalInstance.dismiss).toHaveBeenCalledWith('No');
        });
        it('RemovePeoplePopupCtrl.ok should close modalInstance', function () {
            RemovePeoplePopup.ok();
            expect(modalInstance.close).toHaveBeenCalledWith('yes');
        });
    });
});
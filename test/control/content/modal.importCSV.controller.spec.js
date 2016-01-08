describe('Unit : peoplePluginContent content people remove modal', function () {
    var ImportCSVPopup, scope, $rootScope, $controller,modalInstance;
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
        ImportCSVPopup = $controller('ImportCSVPopupCtrl', {
            $scope: scope,
            $modalInstance:modalInstance,
            fileData: {}
        });
    });

    describe('It will test the defined methods', function () {
        it('it should pass if ImportCSVPopup is defined', function () {
            expect(ImportCSVPopup).not.toBeUndefined();
        });
        it('RemovePeoplePopupCtrl.cancel should close modalInstance', function () {
            ImportCSVPopup.cancel();
            expect(modalInstance.dismiss).toHaveBeenCalledWith('Dismiss');
        });
        it('RemovePeoplePopupCtrl.ok should close modalInstance', function () {
            ImportCSVPopup.fileData = "Name,Rishabh";
            ImportCSVPopup.ok();
        });
    });
});
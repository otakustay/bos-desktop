define(['diffNode'], function (_diffNode) {
    'use strict';

    describe('createDiffNode method', function () {
        it('should create an object with expected properties', function () {
            var changeType = 'change';
            var oldValue = 1;
            var newValue = 2;
            var node = (0, _diffNode.createDiffNode)(changeType, oldValue, newValue);
            expect(node).toEqual({ changeType: changeType, oldValue: oldValue, newValue: newValue });
        });
    });

    describe('isDiffNode method', function () {
        it('should pass if an object is created from `createDiffNode` function', function () {
            var node = (0, _diffNode.createDiffNode)('change', 1, 2);
            expect((0, _diffNode.isDiffNode)(node)).toBe(true);
        });

        it('should fail if an object is not created from `createDiffNode` function', function () {
            var node = { changeType: 'change', oldValue: 1, newValue: 2 };
            expect((0, _diffNode.isDiffNode)(node)).toBe(false);
        });
    });
});
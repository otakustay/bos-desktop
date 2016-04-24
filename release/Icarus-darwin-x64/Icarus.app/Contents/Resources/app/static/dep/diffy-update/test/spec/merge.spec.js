define(['diffNode', 'merge'], function (_diffNode, _merge) {
    'use strict';

    describe('mergeDiffNode function', function () {
        it('should merge addition and removal', function () {
            var x = (0, _diffNode.createDiffNode)('add', undefined, 2);
            var y = (0, _diffNode.createDiffNode)('remove', 2, undefined);
            var node = (0, _merge.mergeDiffNode)(x, y);
            expect(node).toEqual(null);
        });

        it('should merge addition and change', function () {
            var x = (0, _diffNode.createDiffNode)('add', undefined, 2);
            var y = (0, _diffNode.createDiffNode)('change', 2, 3);
            var node = (0, _merge.mergeDiffNode)(x, y);
            expect(node).toEqual({ changeType: 'add', oldValue: undefined, newValue: 3 });
        });

        it('should merge change and removal', function () {
            var x = (0, _diffNode.createDiffNode)('change', 1, 2);
            var y = (0, _diffNode.createDiffNode)('remove', 2, undefined);
            var node = (0, _merge.mergeDiffNode)(x, y);
            expect(node).toEqual({ changeType: 'remove', oldValue: 1, newValue: undefined });
        });

        it('should merge 2 changes', function () {
            var x = (0, _diffNode.createDiffNode)('change', 1, 2);
            var y = (0, _diffNode.createDiffNode)('change', 2, 3);
            var node = (0, _merge.mergeDiffNode)(x, y);
            expect(node).toEqual({ changeType: 'change', oldValue: 1, newValue: 3 });
        });

        it('should merge removal and addition', function () {
            var x = (0, _diffNode.createDiffNode)('remove', 1, undefined);
            var y = (0, _diffNode.createDiffNode)('add', undefined, 2);
            var node = (0, _merge.mergeDiffNode)(x, y);
            expect(node).toEqual({ changeType: 'change', oldValue: 1, newValue: 2 });
        });
    });

    describe('mergeDiff function', function () {
        it('should merge diffs from different properties', function () {
            var oldValue = { x: { a: 1, b: 2 } };
            var newValue = { x: { a: 2, b: 3 } };
            var x = {
                x: {
                    a: (0, _diffNode.createDiffNode)('change', 1, 2)
                }
            };
            var y = {
                x: {
                    b: (0, _diffNode.createDiffNode)('change', 2, 3)
                }
            };
            var node = (0, _merge.mergeDiff)(x, y, oldValue, newValue);
            expect(node).toEqual({
                x: {
                    a: {
                        changeType: 'change',
                        oldValue: 1,
                        newValue: 2
                    },
                    b: {
                        changeType: 'change',
                        oldValue: 2,
                        newValue: 3
                    }
                }
            });
        });

        it('should merge diff for an update of property after its child prpoerty updates', function () {
            var oldValue = { x: { y: { a: 1, b: 2 } } };
            var newValue = { x: 1 };
            var x = {
                x: {
                    y: {
                        c: (0, _diffNode.createDiffNode)('add', undefined, 3)
                    }
                }
            };
            var y = {
                x: (0, _diffNode.createDiffNode)('change', oldValue.x /* 没用 */, 1)
            };
            var node = (0, _merge.mergeDiff)(x, y, oldValue, newValue);
            expect(node).toEqual({
                x: {
                    changeType: 'change',
                    oldValue: {
                        y: {
                            a: 1,
                            b: 2
                        }
                    },
                    newValue: 1
                }
            });
        });

        it('should merge diff for an update of property after its parent prpoerty updates', function () {
            var oldValue = { x: { y: { a: 1, b: 2 } } };
            var newValue = { x: { y: [1] } };
            var x = {
                x: (0, _diffNode.createDiffNode)('change', oldValue.x, { y: [] })
            };
            var y = {
                x: {
                    y: (0, _diffNode.createDiffNode)('change', { y: [] } /* 没用 */, { y: [1] })
                }
            };
            var node = (0, _merge.mergeDiff)(x, y, oldValue, newValue);
            expect(node).toEqual({
                x: {
                    changeType: 'change',
                    oldValue: {
                        y: {
                            a: 1,
                            b: 2
                        }
                    },
                    newValue: {
                        y: [1]
                    }
                }
            });
        });
    });
});
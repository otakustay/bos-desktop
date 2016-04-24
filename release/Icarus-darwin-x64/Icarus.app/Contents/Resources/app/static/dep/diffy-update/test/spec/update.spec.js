define(['update', 'diffNode'], function (_update, _diffNode) {
    'use strict';

    var _update2 = _interopRequireDefault(_update);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    function createSourceObject() {
        return {
            x: {
                y: {
                    z: [1, 2, 3]
                }
            },
            foo: [1, 2, 3],
            alice: 1,
            bob: 2,
            tom: {
                jack: 1
            }
        };
    }

    describe('withDiff method', function () {
        it('should update a single property value', function () {
            var source = createSourceObject();

            var _withDiff = (0, _update.withDiff)(source, { alice: { $set: 2 } });

            var _withDiff2 = _slicedToArray(_withDiff, 2);

            var result = _withDiff2[0];
            var diff = _withDiff2[1];

            expect(result.alice).toBe(2);
            expect((0, _diffNode.isDiffNode)(diff.alice)).toBe(true);
            expect(diff).toEqual({
                alice: {
                    changeType: 'change',
                    oldValue: 1,
                    newValue: 2
                }
            });
            expect(source).toEqual(createSourceObject());
            result.alice = 1;
            expect(result).toEqual(source);
        });

        it('shoud update a nested property value', function () {
            var source = createSourceObject();

            var _withDiff3 = (0, _update.withDiff)(source, { tom: { jack: { $set: 2 } } });

            var _withDiff4 = _slicedToArray(_withDiff3, 2);

            var result = _withDiff4[0];
            var diff = _withDiff4[1];

            expect(result.tom.jack).toBe(2);
            expect((0, _diffNode.isDiffNode)(diff.tom.jack)).toBe(true);
            expect(diff).toEqual({
                tom: {
                    jack: {
                        changeType: 'change',
                        oldValue: 1,
                        newValue: 2
                    }
                }
            });
            expect(source).toEqual(createSourceObject());
            result.tom.jack = 1;
            expect(result).toEqual(source);
        });

        it('should create nested property if not exist', function () {
            var source = createSourceObject();

            var _withDiff5 = (0, _update.withDiff)(source, { a: { b: { $set: 2 } } });

            var _withDiff6 = _slicedToArray(_withDiff5, 2);

            var result = _withDiff6[0];
            var diff = _withDiff6[1];

            expect(result.a.b).toBe(2);
            expect((0, _diffNode.isDiffNode)(diff.a.b)).toBe(true);
            expect(diff).toEqual({
                a: {
                    b: {
                        changeType: 'add',
                        oldValue: undefined,
                        newValue: 2
                    }
                }
            });
            expect(source).toEqual(createSourceObject());
            delete result.a;
            expect(result).toEqual(source);
        });

        it('should recognize push command', function () {
            var source = createSourceObject();

            var _withDiff7 = (0, _update.withDiff)(source, { x: { y: { z: { $push: 4 } } } });

            var _withDiff8 = _slicedToArray(_withDiff7, 2);

            var result = _withDiff8[0];
            var diff = _withDiff8[1];

            expect(result.x.y.z).toEqual([1, 2, 3, 4]);
            expect((0, _diffNode.isDiffNode)(diff.x.y.z)).toBe(true);
            expect(diff).toEqual({
                x: {
                    y: {
                        z: {
                            changeType: 'change',
                            oldValue: [1, 2, 3],
                            newValue: [1, 2, 3, 4]
                        }
                    }
                }
            });
            expect(source).toEqual(createSourceObject());
            result.x.y.z.pop();
            expect(result).toEqual(source);
        });

        it('should recognize unshift command', function () {
            var source = createSourceObject();

            var _withDiff9 = (0, _update.withDiff)(source, { x: { y: { z: { $unshift: 0 } } } });

            var _withDiff10 = _slicedToArray(_withDiff9, 2);

            var result = _withDiff10[0];
            var diff = _withDiff10[1];

            expect(result.x.y.z).toEqual([0, 1, 2, 3]);
            expect((0, _diffNode.isDiffNode)(diff.x.y.z)).toBe(true);
            expect(diff).toEqual({
                x: {
                    y: {
                        z: {
                            changeType: 'change',
                            oldValue: [1, 2, 3],
                            newValue: [0, 1, 2, 3]
                        }
                    }
                }
            });
            expect(source).toEqual(createSourceObject());
            result.x.y.z.shift();
            expect(result).toEqual(source);
        });

        it('should recognize merge command', function () {
            var source = createSourceObject();

            var _withDiff11 = (0, _update.withDiff)(source, { x: { y: { $merge: { a: 1, b: 2, z: source.x.y.z } } } });

            var _withDiff12 = _slicedToArray(_withDiff11, 2);

            var result = _withDiff12[0];
            var diff = _withDiff12[1];

            expect(result.x.y).toEqual({ a: 1, b: 2, z: [1, 2, 3] });
            expect((0, _diffNode.isDiffNode)(diff.x.y.a)).toBe(true);
            expect((0, _diffNode.isDiffNode)(diff.x.y.b)).toBe(true);
            expect(diff).toEqual({
                x: {
                    y: {
                        a: {
                            changeType: 'add',
                            oldValue: undefined,
                            newValue: 1
                        },
                        b: {
                            changeType: 'add',
                            oldValue: undefined,
                            newValue: 2
                        }
                        // Should not have `z` in diff
                    }
                }
            });
            expect(source).toEqual(createSourceObject());
        });

        it('should recognize defaults command', function () {
            var source = createSourceObject();

            var _withDiff13 = (0, _update.withDiff)(source, { x: { y: { $defaults: { a: 1, b: 2, z: 3 } } } });

            var _withDiff14 = _slicedToArray(_withDiff13, 2);

            var result = _withDiff14[0];
            var diff = _withDiff14[1];

            expect(result.x.y).toEqual({ a: 1, b: 2, z: [1, 2, 3] });
            expect((0, _diffNode.isDiffNode)(diff.x.y.a)).toBe(true);
            expect((0, _diffNode.isDiffNode)(diff.x.y.b)).toBe(true);
            expect(diff).toEqual({
                x: {
                    y: {
                        a: {
                            changeType: 'add',
                            oldValue: undefined,
                            newValue: 1
                        },
                        b: {
                            changeType: 'add',
                            oldValue: undefined,
                            newValue: 2
                        }
                        // Should not have `z` in diff
                    }
                }
            });
            expect(source).toEqual(createSourceObject());
        });

        it('should recognize invoke command', function () {
            var source = createSourceObject();

            var _withDiff15 = (0, _update.withDiff)(source, { tom: { jack: {
                        $invoke: function $invoke(x) {
                            return x * 2;
                        }
                    } } });

            var _withDiff16 = _slicedToArray(_withDiff15, 2);

            var result = _withDiff16[0];
            var diff = _withDiff16[1];

            expect(result.tom.jack).toBe(2);
            expect((0, _diffNode.isDiffNode)(diff.tom.jack)).toBe(true);
            expect(diff).toEqual({
                tom: {
                    jack: {
                        changeType: 'change',
                        oldValue: 1,
                        newValue: 2
                    }
                }
            });
            expect(source).toEqual(createSourceObject());
        });

        it('should expose set function', function () {
            var source = createSourceObject();
            var result = (0, _update.set)(source, ['tom', 'jack'], 2);
            expect(result.tom.jack).toBe(2);
            expect(source).toEqual(createSourceObject());
            result.tom.jack = 1;
            expect(result).toEqual(source);
        });

        it('should expose push function', function () {
            var source = createSourceObject();
            var result = (0, _update.push)(source, ['x', 'y', 'z'], 4);
            expect(result.x.y.z).toEqual([1, 2, 3, 4]);
            expect(source).toEqual(createSourceObject());
            result.x.y.z.pop();
            expect(result).toEqual(source);
        });

        it('should expose unshift function', function () {
            var source = createSourceObject();
            var result = (0, _update.unshift)(source, ['x', 'y', 'z'], 0);
            expect(result.x.y.z).toEqual([0, 1, 2, 3]);
            expect(source).toEqual(createSourceObject());
            result.x.y.z.shift();
            expect(result).toEqual(source);
        });

        it('should expose merge function', function () {
            var source = createSourceObject();
            var result = (0, _update.merge)(source, ['x', 'y'], { a: 1, b: 2, z: 3 });
            expect(result.x.y).toEqual({ a: 1, b: 2, z: 3 });
            expect(source).toEqual(createSourceObject());
        });

        it('should expose defaults function', function () {
            var source = createSourceObject();
            var result = (0, _update.defaults)(source, ['x', 'y'], { a: 1, b: 2, z: 3 });
            expect(result.x.y).toEqual({ a: 1, b: 2, z: [1, 2, 3] });
            expect(source).toEqual(createSourceObject());
        });

        it('should expose invoke function', function () {
            var source = createSourceObject();
            var result = (0, _update.invoke)(source, ['tom', 'jack'], function (x) {
                return x * 2;
            });
            expect(result.tom.jack).toBe(2);
            expect(source).toEqual(createSourceObject());
        });

        describe('run with first level command', function () {
            it('should work with $set', function () {
                var source = {};

                var _withDiff17 = (0, _update.withDiff)(source, { $set: 1 });

                var _withDiff18 = _slicedToArray(_withDiff17, 2);

                var result = _withDiff18[0];
                var diff = _withDiff18[1];

                expect(result).toBe(1);
                expect((0, _diffNode.isDiffNode)(diff)).toBe(true);
                expect(diff).toEqual({
                    changeType: 'change',
                    oldValue: source,
                    newValue: result
                });
                expect(source).toEqual({});
            });

            it('should work with $push', function () {
                var source = [1, 2, 3];

                var _withDiff19 = (0, _update.withDiff)(source, { $push: 4 });

                var _withDiff20 = _slicedToArray(_withDiff19, 2);

                var result = _withDiff20[0];
                var diff = _withDiff20[1];

                expect(result).toEqual([1, 2, 3, 4]);
                expect((0, _diffNode.isDiffNode)(diff)).toBe(true);
                expect(diff).toEqual({
                    changeType: 'change',
                    oldValue: source,
                    newValue: result
                });
                expect(source).toEqual([1, 2, 3]);
            });

            it('should work with $unshift', function () {
                var source = [1, 2, 3];

                var _withDiff21 = (0, _update.withDiff)(source, { $unshift: 0 });

                var _withDiff22 = _slicedToArray(_withDiff21, 2);

                var result = _withDiff22[0];
                var diff = _withDiff22[1];

                expect(result).toEqual([0, 1, 2, 3]);
                expect((0, _diffNode.isDiffNode)(diff)).toBe(true);
                expect(diff).toEqual({
                    changeType: 'change',
                    oldValue: source,
                    newValue: result
                });
                expect(source).toEqual([1, 2, 3]);
            });

            it('should work with $merge', function () {
                var source = { foo: 1 };

                var _withDiff23 = (0, _update.withDiff)(source, { $merge: { foo: 3, bar: 2 } });

                var _withDiff24 = _slicedToArray(_withDiff23, 2);

                var result = _withDiff24[0];
                var diff = _withDiff24[1];

                expect(result).toEqual({ foo: 3, bar: 2 });
                expect((0, _diffNode.isDiffNode)(diff.foo)).toBe(true);
                expect((0, _diffNode.isDiffNode)(diff.bar)).toBe(true);
                expect(diff).toEqual({
                    foo: {
                        changeType: 'change',
                        oldValue: 1,
                        newValue: 3
                    },
                    bar: {
                        changeType: 'add',
                        oldValue: undefined,
                        newValue: 2
                    }
                });
                expect(source).toEqual({ foo: 1 });
            });

            it('should work with $defaults', function () {
                var source = { foo: 1 };

                var _withDiff25 = (0, _update.withDiff)(source, { $defaults: { foo: 2, bar: 2 } });

                var _withDiff26 = _slicedToArray(_withDiff25, 2);

                var result = _withDiff26[0];
                var diff = _withDiff26[1];

                expect(result).toEqual({ foo: 1, bar: 2 });
                expect((0, _diffNode.isDiffNode)(diff.bar)).toBe(true);
                expect(diff).toEqual({
                    bar: {
                        changeType: 'add',
                        oldValue: undefined,
                        newValue: 2
                    }
                    // Should not have `foo` in diff
                });
                expect(source).toEqual({ foo: 1 });
            });

            it('should work with $invoke', function () {
                var source = 1;

                var _withDiff27 = (0, _update.withDiff)(source, {
                    $invoke: function $invoke(x) {
                        return x * 2;
                    }
                });

                var _withDiff28 = _slicedToArray(_withDiff27, 2);

                var result = _withDiff28[0];
                var diff = _withDiff28[1];

                expect(result).toEqual(2);
                expect((0, _diffNode.isDiffNode)(diff)).toBe(true);
                expect(diff).toEqual({
                    changeType: 'change',
                    oldValue: source,
                    newValue: result
                });
                expect(source).toEqual(1);
            });

            it('should not generate diff if value is not modified', function () {
                var source = createSourceObject();

                expect((0, _update.withDiff)(source, { $set: source })[1]).toBe(null);
                expect((0, _update.withDiff)(source, { $merge: source })[1]).toBe(null);
                expect((0, _update.withDiff)(source, { $defaults: source })[1]).toBe(null);
                expect((0, _update.withDiff)(source, {
                    $invoke: function $invoke() {
                        return source;
                    }
                })[1]).toBe(null);

                expect((0, _update.withDiff)(source, { foo: { $set: source.foo } })[1]).toBe(null);
                expect((0, _update.withDiff)(source, { x: { y: { $merge: { z: source.x.y.z } } } })[1]).toBe(null);
            });
        });

        describe('update method', function () {
            it('should trim the `diff` object from return', function () {
                var source = createSourceObject();
                expect((0, _update2.default)(source, { x: { $set: 1 } })).toEqual({ x: 1, foo: [1, 2, 3], alice: 1, bob: 2, tom: { jack: 1 } });
            });
        });

        describe('shortcut function with first level command', function () {
            it('should work with $set', function () {
                var source = {};
                var result = (0, _update.set)(source, null, 1);
                expect(result).toBe(1);
                expect(source).toEqual({});
            });

            it('should work with $push', function () {
                var source = [1, 2, 3];
                var result = (0, _update.push)(source, null, 4);
                expect(result).toEqual([1, 2, 3, 4]);
                expect(source).toEqual([1, 2, 3]);
            });

            it('should work with $unshift', function () {
                var source = [1, 2, 3];
                var result = (0, _update.unshift)(source, null, 0);
                expect(result).toEqual([0, 1, 2, 3]);
                expect(source).toEqual([1, 2, 3]);
            });

            it('should work with $merge', function () {
                var source = { foo: 1 };
                var result = (0, _update.merge)(source, null, { bar: 2 });
                expect(result).toEqual({ foo: 1, bar: 2 });
                expect(source).toEqual({ foo: 1 });
            });

            it('should work with $defaults', function () {
                var source = { foo: 1 };
                var result = (0, _update.defaults)(source, null, { foo: 2, bar: 2 });
                expect(result).toEqual({ foo: 1, bar: 2 });
                expect(source).toEqual({ foo: 1 });
            });

            it('should work with $invoke', function () {
                var source = 1;
                var result = (0, _update.invoke)(source, null, function (x) {
                    return x * 2;
                });
                expect(result).toEqual(2);
                expect(source).toEqual(1);
            });
        });
    });
});
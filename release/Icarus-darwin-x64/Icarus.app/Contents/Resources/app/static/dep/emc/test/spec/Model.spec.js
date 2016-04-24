define(['Model'], function (_Model2) {
    'use strict';

    var _Model3 = _interopRequireDefault(_Model2);

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

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
    };

    describe('Model', function () {
        it('should be a constructor', function () {
            expect(typeof _Model3.default === 'undefined' ? 'undefined' : _typeof(_Model3.default)).toBe('function');
        });

        describe('constructor', function () {
            it('should work without any argument', function () {
                var model = new _Model3.default();
                expect(model).toBeDefined();
            });

            it('should fill itself if a context is given', function () {
                var context = { x: 1, y: 2 };
                var model = new _Model3.default(context);
                expect(model.get('x')).toBe(1);
                expect(model.get('y')).toBe(2);
            });

            it('should not effect the model if context object is modified', function () {
                var context = { x: 1, y: 2 };
                var model = new _Model3.default(context);
                context.x = 2;
                expect(model.get('x')).toBe(1);
            });
        });

        describe('get method', function () {
            it('should return the property value', function () {
                var model = new _Model3.default({ x: 1 });
                expect(model.get('x')).toBe(1);
            });

            it('should return undefined if property does not exist', function () {
                var model = new _Model3.default();
                expect(model.get('x')).toBeUndefined();
            });

            it('should not read properties on Object.prototype', function () {
                Object.prototype.x = 1;
                var model = new _Model3.default();
                expect(model.get('x')).toBeUndefined();
                delete Object.prototype.x;
            });

            it('should throw if name is not provided', function () {
                var model = new _Model3.default();
                expect(function () {
                    model.get();
                }).toThrow();
                expect(function () {
                    model.get(undefined);
                }).toThrow();
                expect(function () {
                    model.get(null);
                }).toThrow();
            });
        });

        describe('set method', function () {
            it('should change the value of a property', function () {
                var model = new _Model3.default();
                model.set('x', 1);
                expect(model.get('x')).toBe(1);
            });

            it('should accept undefined value', function () {
                var model = new _Model3.default();
                model.set('x', undefined);
                expect(model.get('x')).toBeUndefined();
            });

            it('should throw if name is not provided', function () {
                var model = new _Model3.default();
                expect(function () {
                    model.set(undefined, 1);
                }).toThrow();
                expect(function () {
                    model.set(null, 1);
                }).toThrow();
            });

            it('should fire beforechange event when change a property', function () {
                var model = new _Model3.default();
                model.set('x', 1);
                var beforeChange = jasmine.createSpy('beforechange');
                model.on('beforechange', beforeChange);
                model.set('x', 2);
                expect(beforeChange).toHaveBeenCalled();
                var eventObject = beforeChange.calls.mostRecent().args[0];
                expect(eventObject.type).toBe('beforechange');
                expect(eventObject.changeType).toBe('change');
                expect(eventObject.oldValue).toBe(1);
                expect(eventObject.newValue).toBe(2);
                expect(eventObject.actualValue).toBe(2);
            });

            it('should fire beforechange event when add a property', function () {
                var model = new _Model3.default();
                var beforeChange = jasmine.createSpy('beforechange');
                model.on('beforechange', beforeChange);
                model.set('x', 1);
                expect(beforeChange).toHaveBeenCalled();
                var eventObject = beforeChange.calls.mostRecent().args[0];
                expect(eventObject.type).toBe('beforechange');
                expect(eventObject.changeType).toBe('add');
                expect(eventObject.oldValue).toBe(undefined);
                expect(eventObject.newValue).toBe(1);
                expect(eventObject.actualValue).toBe(1);
            });

            it('should not fire beforechange event when value is not changed', function () {
                var model = new _Model3.default();
                var beforeChange = jasmine.createSpy('beforechange');
                model.set('x', 1);
                model.on('beforechange', beforeChange);
                model.set('x', 1);
                expect(beforeChange).not.toHaveBeenCalled();
            });

            it('should not fire beforechange event if silent flag is explicitly set', function () {
                var model = new _Model3.default();
                var beforeChange = jasmine.createSpy('beforechange');
                model.set('x', 1);
                model.on('beforechange', beforeChange);
                model.set('x', 2, { silent: true });
                expect(beforeChange).not.toHaveBeenCalled();
                expect(model.get('x')).toBe(2);
            });

            it('should not change value if beforechange event is default prevented', function () {
                var model = new _Model3.default();
                var beforeChange = function beforeChange(e) {
                    e.preventDefault();
                };
                model.on('beforechange', beforeChange);
                var change = jasmine.createSpy('change');
                model.on('change', change);
                model.set('x', 1);
                expect(model.has('x')).toBe(false);
                expect(change).not.toHaveBeenCalled();
            });

            it('should use actualValue of event object instead of value given by set method call', function () {
                var model = new _Model3.default();
                var beforeChange = function beforeChange(e) {
                    e.actualValue = 2;
                };
                model.on('beforechange', beforeChange);
                model.set('x', 1);
                expect(model.get('x')).toBe(2);
            });

            it('should not fire change event if actualValue is set to the same previous value', function () {
                var model = new _Model3.default();
                model.set('x', 1);
                model.on('beforechange', function (e) {
                    return e.actualValue = 1;
                });
                var change = jasmine.createSpy('change');
                model.on('change', change);
                model.set('x', 2);
                expect(change).not.toHaveBeenCalled();
            });
        });

        describe('remove method', function () {
            it('should remove a property', function () {
                var model = new _Model3.default();
                model.set('x', 1);
                model.remove('x');
                expect(model.get('x')).toBeUndefined();
            });

            it('should throw if name is not provided', function () {
                var model = new _Model3.default();
                expect(function () {
                    return model.remove();
                }).toThrow();
                expect(function () {
                    return model.remove(undefined);
                }).toThrow();
                expect(function () {
                    return model.remove(null);
                }).toThrow();
            });

            it('should fire beforechange event if property previously has a value', function () {
                var model = new _Model3.default();
                model.set('x', 1);
                var change = jasmine.createSpy('beforechange');
                model.on('beforechange', change);
                model.remove('x');
                expect(change).toHaveBeenCalled();
                var eventObject = change.calls.mostRecent().args[0];
                expect(eventObject.changeType).toBe('remove');
                expect(eventObject.oldValue).toBe(1);
                expect(eventObject.newValue).toBe(undefined);
            });

            it('should fire beforechange event if property previously exists (even undefined)', function () {
                var model = new _Model3.default();
                model.set('x', undefined);
                var beforeChange = jasmine.createSpy('beforechange');
                model.on('beforechange', beforeChange);
                model.remove('x');
                expect(beforeChange).toHaveBeenCalled();
                var eventObject = beforeChange.calls.mostRecent().args[0];
                expect(eventObject.changeType).toBe('remove');
                expect(eventObject.oldValue).toBe(undefined);
                expect(eventObject.newValue).toBe(undefined);
            });

            it('should not fire beforechange event is property did not previously exist', function () {
                var model = new _Model3.default();
                var beforeChange = jasmine.createSpy('beforechange');
                model.on('beforechange', beforeChange);
                model.remove('x');
                expect(beforeChange).not.toHaveBeenCalled();
            });

            it('should not fire beforechange event if silent flag is explicitly set', function () {
                var model = new _Model3.default();
                model.set('x', 1);
                var beforeChange = jasmine.createSpy('beforechange');
                model.on('beforechange', beforeChange);
                model.remove('x', { silent: true });
                expect(beforeChange).not.toHaveBeenCalled();
            });

            it('should not remove value if beforechange event is default prevented', function () {
                var model = new _Model3.default();
                var beforeChange = function beforeChange(e) {
                    e.preventDefault();
                };
                model.set('x', 1);
                model.on('beforechange', beforeChange);
                model.remove('x');
                expect(model.get('x')).toBe(1);
            });

            it('should fire update event for existing property', function (done) {
                var model = new _Model3.default({ x: 1 });
                var update = function update(e) {
                    expect(e.diff).toEqual({
                        x: {
                            changeType: 'remove',
                            oldValue: 1,
                            newValue: undefined
                        }
                    });
                    done();
                };
                model.on('update', update);
                model.remove('x');
            });
        });

        describe('update method', function () {
            it('should update a property', function () {
                var model = new _Model3.default({ x: 1, y: [1, 2, 3], z: [2, 3, 4] });
                model.update({ x: { $set: 2 }, y: { $push: 4 }, z: { $unshift: 1 } });
                expect(model.get('x')).toBe(2);
                expect(model.get('y')).toEqual([1, 2, 3, 4]);
                expect(model.get('z')).toEqual([1, 2, 3, 4]);
            });

            it('should update a nested property', function () {
                var model = new _Model3.default({ x: { y: 1 } });
                model.update({ x: { y: { $set: 2 } } });
                expect(model.get('x').y).toBe(2);
            });

            it('should fire beforechange events for each property modified', function () {
                var model = new _Model3.default({ x: 1, y: [1, 2, 3], z: { a: 1, b: 2 } });
                var beforeChange = jasmine.createSpy('beforeChange');
                model.on('beforechange', beforeChange);
                model.update({
                    // `x` is not modifed.
                    x: { $set: 1 },
                    // `y` is modified to a new array.
                    y: { $push: 4 },
                    // `z` becomes a new object although its properties are not changed.
                    z: { $merge: { a: 1 } }
                });
                expect(beforeChange.calls.count()).toBe(2);
            });

            it('should cancel value assignment if beforechange event is default prevented', function () {
                var z = { a: 1, b: 2 };
                var model = new _Model3.default({ x: 1, y: [1, 2, 3], z: z });
                var beforeChange = jasmine.createSpy('beforeChange');
                model.on('beforechange', function (e) {
                    e.name === 'z' && e.preventDefault();
                });
                model.update({
                    z: { $merge: { a: 2 } }
                });
                // `z` is not changed since `beforechange` is default prevented.
                expect(model.get('z')).toBe(z);
            });
        });

        describe('dump method', function () {
            it('should return a plain object with all properties', function () {
                var context = { x: 1, y: 2 };
                var model = new _Model3.default(context);
                var dumpValue = model.dump();
                expect(dumpValue).toEqual(context);
            });

            it('should not effect the model if the dump object is modified', function () {
                var context = { x: 1, y: 2 };
                var model = new _Model3.default(context);
                var dumpValue = model.dump();
                dumpValue.x = 2;
                expect(model.get('x')).toBe(1);
            });

            it('should not dump properties on prototype chain', function () {
                Object.prototype.x = 1;
                var model = new _Model3.default();
                var dumpValue = model.dump();
                delete Object.prototype.x;
                expect(model.x).toBeUndefined();
            });
        });

        describe('has* method', function () {
            it('should determine whether a property exists by has method', function () {
                var model = new _Model3.default();
                model.set('x', 1);
                model.set('y', undefined);
                expect(model.has('x')).toBe(true);
                expect(model.has('y')).toBe(true);
                expect(model.has('z')).toBe(false);
            });

            it('should throw if name is not provided', function () {
                var model = new _Model3.default();
                expect(function () {
                    return model.has();
                }).toThrow();
                expect(function () {
                    return model.has(undefined);
                }).toThrow();
                expect(function () {
                    return model.has(null);
                }).toThrow();
                expect(function () {
                    return model.hasValue();
                }).toThrow();
                expect(function () {
                    return model.hasValue(undefined);
                }).toThrow();
                expect(function () {
                    return model.hasValue(null);
                }).toThrow();
                expect(function () {
                    return model.hasReadableValue();
                }).toThrow();
                expect(function () {
                    return model.hasReadableValue(undefined);
                }).toThrow();
                expect(function () {
                    return model.hasReadableValue(null);
                }).toThrow();
            });

            it('should determine whether a property has a non-null value by hasValue method', function () {
                var model = new _Model3.default();
                model.set('x', 1);
                model.set('y', undefined);
                expect(model.hasValue('x')).toBe(true);
                expect(model.hasValue('y')).toBe(false);
                expect(model.hasValue('z')).toBe(false);
            });

            it('should determine whether a property has a readable value by hasValue method', function () {
                var model = new _Model3.default();
                model.set('x', 1);
                model.set('y', undefined);
                model.set('z', '');
                expect(model.hasReadableValue('x')).toBe(true);
                expect(model.hasReadableValue('y')).toBe(false);
                expect(model.hasReadableValue('z')).toBe(false);
            });
        });

        describe('dispose method', function () {
            it('should throw error on get or set after dispose', function () {
                var model = new _Model3.default();
                model.dispose();
                expect(function () {
                    return model.get('x');
                }).toThrow();
                expect(function () {
                    return model.set('x', 1);
                }).toThrow();
                expect(function () {
                    return model.fill({});
                }).toThrow();
                expect(function () {
                    return model.remove('x');
                }).toThrow();
                expect(function () {
                    return model.getAsModel('x');
                }).toThrow();
                expect(function () {
                    return model.clone();
                }).toThrow();
            });

            it('should have no side effect when dispose multiple times', function () {
                var model = new _Model3.default();
                model.dispose();
                expect(function () {
                    return model.dispose();
                }).not.toThrow();
            });

            it('should always dump an empty object after dispose', function () {
                var model = new _Model3.default();
                model.dispose();
                expect(model.dump()).toEqual({});
            });

            it('should always return false for has* method after dispose', function () {
                var model = new _Model3.default();
                model.set('x', 1);
                model.dispose();
                expect(model.has('x')).toBe(false);
                expect(model.hasValue('x')).toBe(false);
                expect(model.hasReadableValue('x')).toBe(false);
            });
        });

        describe('update event', function () {
            it('should fire when a property is changed', function (done) {
                var model = new _Model3.default();
                model.set('x', 1);
                model.set('y', 2);
                model.on('update', function (e) {
                    expect(e.diff).toEqual({
                        x: {
                            changeType: 'add',
                            oldValue: undefined,
                            newValue: 2
                        },
                        y: {
                            changeType: 'add',
                            oldValue: undefined,
                            newValue: 2
                        }
                    });
                    done();
                });
                model.set('x', 2);
            });

            it('should not fire when there is actually no change', function (done) {
                var model = new _Model3.default({ x: 1 });
                var update = jasmine.createSpy('update');
                model.on('update', update);
                model.set('x', 2);
                model.set('x', 1);
                setTimeout(function () {
                    expect(update).not.toHaveBeenCalled();
                    done();
                }, 10);
            });

            it('should not fire if a nested property has updates but no changes', function (done) {
                var o = { z: 1 };
                var model = new _Model3.default({ x: { y: o } });
                var update = jasmine.createSpy('update');
                model.on('update', update);
                model.update({ x: { y: { $merge: { a: 1, b: 2 } } } });
                model.update({ x: { y: { $set: o } } });
                setTimeout(function () {
                    expect(update).not.toHaveBeenCalled();
                    done();
                }, 10);
            });

            it('should merge diffs from multiple $set command', function (done) {
                var model = new _Model3.default({ x: { a: 1, b: 2 } });
                model.on('update', function (e) {
                    expect(e.diff).toEqual({
                        x: {
                            a: {
                                changeType: 'change',
                                oldValue: 1,
                                newValue: 3
                            }
                        }
                    });
                    done();
                });
                model.update({ x: { a: { $set: 2 }, b: { $set: 3 } } });
                model.update({ x: { a: { $set: 3 }, b: { $set: 2 } } });
            });

            it('should merge diff for an update of property after its child prpoerty updates', function (done) {
                var model = new _Model3.default({ x: { y: { a: 1, b: 2 } } });
                model.on('update', function (e) {
                    expect(e.diff).toEqual({
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
                    done();
                });
                model.update({ x: { y: { $merge: { c: 3 } } } });
                model.update({ x: { $set: 1 } });
            });

            it('should merge diff for an update of property after its parent prpoerty updates', function (done) {
                var model = new _Model3.default({ x: { y: { a: 1, b: 2 } } });
                model.on('update', function (e) {
                    expect(e.diff).toEqual({
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
                    done();
                });
                model.update({ x: { $set: { y: [] } } });
                model.update({ x: { y: { $push: 1 } } });
            });
        });

        var Rectangle = function (_Model) {
            _inherits(Rectangle, _Model);

            function Rectangle(initialData) {
                _classCallCheck(this, Rectangle);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Rectangle).call(this, initialData));

                _this.defineComputedProperty('size', ['width', 'height'], {
                    get: function get() {
                        if (!this.has('width') || !this.has('height')) {
                            return undefined;
                        }

                        return this.get('width') + '*' + this.get('height');
                    },
                    set: function set(value, options) {
                        var _ref = value ? value.split('*').map(Number) : [undefined, undefined];

                        var _ref2 = _slicedToArray(_ref, 2);

                        var width = _ref2[0];
                        var height = _ref2[1];

                        this.set('width', width, options);
                        this.set('height', height, options);
                    },

                    evaluate: true
                });

                _this.defineComputedProperty('perimeter', ['width', 'height'], function () {
                    return this.get('width') * 2 + this.get('height') * 2;
                });

                _this.defineComputedProperty('shorterEdge', ['width', 'height'], {
                    get: function get() {
                        return Math.min(this.get('width'), this.get('height'));
                    },

                    evaluate: true
                });
                return _this;
            }

            return Rectangle;
        }(_Model3.default);

        describe('computed properties', function () {
            it('should accept custom get function', function () {
                var rectangle = new Rectangle({ width: 2, height: 3 });
                expect(rectangle.get('size')).toBe('2*3');
            });

            it('should change with dependencies', function () {
                var rectangle = new Rectangle({ width: 2, height: 3 });
                rectangle.set('width', 3);
                expect(rectangle.get('size')).toBe('3*3');
            });

            it('should change with dependency updates', function () {
                var rectangle = new Rectangle({ width: 2, height: 3 });
                rectangle.update({ width: { $set: 3 }, height: { $set: 4 } });
                expect(rectangle.get('size')).toBe('3*4');
            });

            it('should accept custom set function', function () {
                var rectangle = new Rectangle({ width: 2, height: 3 });
                rectangle.set('size', '4*5');
                expect(rectangle.get('width')).toBe(4);
                expect(rectangle.get('height')).toBe(5);
            });

            it('should fire change event when dependency changes', function () {
                var rectangle = new Rectangle({ width: 2, height: 3 });
                var change = jasmine.createSpy('change');
                rectangle.on('change', change);
                rectangle.set('width', 3);
                expect(change.calls.count()).toBe(4); // width + perimeter + size + shorterEdge
                var changeEvent = change.calls.all().filter(function (e) {
                    return e.args[0].name === 'size';
                })[0];
                expect(changeEvent).not.toBeUndefined();
                expect(changeEvent.args[0].oldValue).toBe('2*3');
                expect(changeEvent.args[0].newValue).toBe('3*3');
            });

            it('should fire change event when dependency updates', function () {
                var rectangle = new Rectangle({ width: 2, height: 3 });
                var change = jasmine.createSpy('change');
                rectangle.on('change', change);
                rectangle.update({ width: { $set: 3 }, height: { $set: 4 } });
                expect(change.calls.count()).toBe(5); // width + height + perimeter + size + shorterEdge
                var changeEvent = change.calls.all().filter(function (e) {
                    return e.args[0].name === 'size';
                })[0];
                expect(changeEvent).not.toBeUndefined();
                expect(changeEvent.args[0].oldValue).toBe('2*3');
                expect(changeEvent.args[0].newValue).toBe('3*4');
            });

            it('should fire change event for dependencies when set', function () {
                var rectangle = new Rectangle({ width: 2, height: 3 });
                var change = jasmine.createSpy('change');
                rectangle.on('change', change);
                rectangle.set('size', '3*4');

                expect(change.calls.count()).toBe(5); // width + height + perimeter + size + shorterEdge

                var widthChangeEvent = change.calls.all().filter(function (e) {
                    return e.args[0].name === 'width';
                })[0];
                expect(widthChangeEvent).not.toBeUndefined();
                expect(widthChangeEvent.args[0].oldValue).toBe(2);
                expect(widthChangeEvent.args[0].newValue).toBe(3);

                var heightChangeEvent = change.calls.all().filter(function (e) {
                    return e.args[0].name === 'height';
                })[0];
                expect(heightChangeEvent).not.toBeUndefined();
                expect(heightChangeEvent.args[0].oldValue).toBe(3);
                expect(heightChangeEvent.args[0].newValue).toBe(4);

                var perimeterChangeEvent = change.calls.all().filter(function (e) {
                    return e.args[0].name === 'perimeter';
                })[0];
                expect(perimeterChangeEvent).not.toBeUndefined();
                expect(perimeterChangeEvent.args[0].oldValue).toBe(undefined); // lazy
                expect(perimeterChangeEvent.args[0].newValue).toBe(14);
            });

            it('should compare values and filter only real changes', function () {
                var rectangle = new Rectangle({ width: 2, height: 3 });
                var change = jasmine.createSpy('change');
                rectangle.on('change', change);
                rectangle.set('size', '3*2');

                expect(change.calls.count()).toBe(4); // Only width + height + size + shorterEdge

                var shorterEdgeChangeEvent = change.calls.all().filter(function (e) {
                    return e.args[0].name === 'shorterEdge';
                })[0];
                expect(shorterEdgeChangeEvent).toBeUndefined();
            });

            it('should not fire beforechange event when set', function () {
                var rectangle = new Rectangle({ width: 2, height: 3 });
                var beforeChange = jasmine.createSpy('beforeChange');
                rectangle.on('beforechange', beforeChange);
                rectangle.set('size', '3*4');

                var sizeBeforeChangeEvent = beforeChange.calls.all().filter(function (e) {
                    return e.args[0].name === 'size';
                })[0];
                expect(sizeBeforeChangeEvent).toBeUndefined();
            });

            it('should fire update event', function (done) {
                var rectangle = new Rectangle({ width: 2, height: 3 });
                rectangle.on('update', function (e) {
                    expect(e.diff).toEqual({
                        width: {
                            changeType: 'change',
                            oldValue: 2,
                            newValue: 3
                        },
                        height: {
                            changeType: 'change',
                            oldValue: 3,
                            newValue: 4
                        },
                        perimeter: {
                            changeType: 'change',
                            oldValue: undefined,
                            newValue: 14
                        },
                        size: {
                            changeType: 'change',
                            oldValue: '2*3',
                            newValue: '3*4'
                        },
                        shorterEdge: {
                            changeType: 'change',
                            oldValue: 2,
                            newValue: 3
                        }
                    });
                    done();
                });
                rectangle.set('size', '3*4');
            });
        });
    });
});
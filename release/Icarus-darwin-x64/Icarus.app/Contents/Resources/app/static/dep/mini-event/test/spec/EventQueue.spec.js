define(['EventQueue'], function (_EventQueue) {
    'use strict';

    var _EventQueue2 = _interopRequireDefault(_EventQueue);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
    };

    describe('EventQueue', function () {
        it('should be a constructor', function () {
            expect(typeof _EventQueue2.default === 'undefined' ? 'undefined' : _typeof(_EventQueue2.default)).toBe('function');
        });

        it('should be instantiable', function () {
            expect(_typeof(new _EventQueue2.default())).toBe('object');
        });

        describe('`add` method', function () {
            it('should exist', function () {
                var queue = new _EventQueue2.default();
                expect(_typeof(queue.add)).toBe('function');
            });

            it('should be safe to add a function handler', function () {
                var queue = new _EventQueue2.default();
                var handler = function handler() {};
                expect(function () {
                    return queue.add(handler);
                }).not.toThrow();
            });

            it('should be safe to add a function handler with `options` object', function () {
                var queue = new _EventQueue2.default();
                var handler = function handler() {};
                var options = {
                    thieObject: {},
                    once: true
                };
                expect(function () {
                    return queue.add(handler, options);
                }).not.toThrow();
            });

            it('should be safe to add `false` as handler', function () {
                var queue = new _EventQueue2.default();
                expect(function () {
                    return queue.add(false);
                }).not.toThrow();
            });

            it('should throw an error if a non-function and non-false handler is given', function () {
                var queue = new _EventQueue2.default();
                expect(function () {
                    return queue.add({});
                }).toThrow();
            });
        });

        describe('`remove` method', function () {
            it('should exist', function () {
                var queue = new _EventQueue2.default();
                expect(_typeof(queue.remove)).toBe('function');
            });

            it('should be safe to remove an attached handler', function () {
                var queue = new _EventQueue2.default();
                var handler = function handler() {};
                queue.add(handler);
                expect(function () {
                    return queue.remove(handler);
                }).not.toThrow();
            });

            it('should be safe to remove a non-attached handler', function () {
                var queue = new _EventQueue2.default();
                var handler = function handler() {};
                expect(function () {
                    return queue.remove(handler);
                }).not.toThrow();
            });

            it('should be safe to remove all handlers by not providing `handler` argument', function () {
                var queue = new _EventQueue2.default();
                expect(function () {
                    return queue.remove();
                }).not.toThrow();
            });
        });

        describe('`clear` method', function () {
            it('should exist', function () {
                var queue = new _EventQueue2.default();
                expect(_typeof(queue.clear)).toBe('function');
            });

            it('should be safe to clear the queue', function () {
                var queue = new _EventQueue2.default();
                expect(function () {
                    return queue.clear();
                }).not.toThrow();
            });
        });

        describe('`exeute` method', function () {
            it('should exist', function () {
                var queue = new _EventQueue2.default();
                expect(_typeof(queue.execute)).toBe('function');
            });

            it('should pass the `event` object to handler', function () {
                var queue = new _EventQueue2.default();
                var handler = jasmine.createSpy('handler');
                queue.add(handler);
                var event = {};
                queue.execute(event, null);
                expect(handler).toHaveBeenCalled();
                expect(handler.calls.mostRecent().args[0]).toBe(event);
            });

            it('should pass the `thisObject` object as `this` to handler', function () {
                var queue = new _EventQueue2.default();
                var handler = jasmine.createSpy('handler');
                queue.add(handler);
                var thisObject = {};
                queue.execute({}, thisObject);
                expect(handler).toHaveBeenCalled();
                expect(handler.calls.mostRecent().object).toBe(thisObject);
            });

            it('should use the `thisObject` specified when add instead of the given one', function () {
                var queue = new _EventQueue2.default();
                var handler = jasmine.createSpy('handler');
                var thisObject = {};
                queue.add(handler, { thisObject: thisObject });
                queue.execute({}, null);
                expect(handler).toHaveBeenCalled();
                expect(handler.calls.mostRecent().object).toBe(thisObject);
            });

            it('should execute attached handler by attaching order', function () {
                var queue = new _EventQueue2.default();
                var order = [];
                var handlerA = function handlerA() {
                    return order.push(1);
                };
                var handlerB = function handlerB() {
                    return order.push(2);
                };
                queue.add(handlerA);
                queue.add(handlerB);
                queue.execute({}, null);
                expect(order).toEqual([1, 2]);
            });

            it('should not execute removed handler', function () {
                var queue = new _EventQueue2.default();
                var handlerA = jasmine.createSpy('handlerA');
                var handlerB = jasmine.createSpy('handlerB');
                queue.add(handlerA);
                queue.add(handlerB);
                queue.remove(handlerA);
                queue.execute({}, null);
                expect(handlerA).not.toHaveBeenCalled();
            });

            it('should not execute any handler if it is cleared', function () {
                var queue = new _EventQueue2.default();
                var handlerA = jasmine.createSpy('handlerA');
                var handlerB = jasmine.createSpy('handlerB');
                queue.add(handlerA);
                queue.add(handlerB);
                queue.remove();
                queue.execute({}, null);
                expect(handlerA).not.toHaveBeenCalled();
                expect(handlerB).not.toHaveBeenCalled();

                queue.add(handlerA);
                queue.add(handlerB);
                queue.clear();
                queue.execute({}, null);
                expect(handlerA).not.toHaveBeenCalled();
                expect(handlerB).not.toHaveBeenCalled();
            });

            it('should not execute removed handler event it is removed when the queue is executing', function () {
                var queue = new _EventQueue2.default();
                var handlerA = function handlerA() {
                    return queue.remove(handlerB);
                };
                var handlerB = jasmine.createSpy('handlerB');
                queue.add(handlerA);
                queue.add(handlerB);
                queue.execute({}, null);
                expect(handlerB).not.toHaveBeenCalled();
            });

            it('should execute handler only once if `once` option is specified', function () {
                var queue = new _EventQueue2.default();
                var handler = jasmine.createSpy();
                queue.add(handler, { once: true });
                queue.execute({}, null);
                queue.execute({}, null);
                expect(handler.calls.count()).toBe(1);
            });

            it('should keep all handler in order and executed even one handler is removed when executing', function () {
                var queue = new _EventQueue2.default();
                var handlerA = jasmine.createSpy('handlerA').and.callFake(function () {
                    return queue.remove(handlerB);
                });
                var handlerB = jasmine.createSpy('handlerB');
                var handlerC = jasmine.createSpy('handlerC');
                var handlerD = jasmine.createSpy('handlerD');
                queue.add(handlerA);
                queue.add(handlerB);
                queue.add(handlerC);
                queue.add(handlerD);
                queue.execute({}, null);
                expect(handlerA).toHaveBeenCalled();
                expect(handlerC).toHaveBeenCalled();
                expect(handlerD).toHaveBeenCalled();
            });

            it('should not execute following handlers if event is immediately stopped', function () {
                var queue = new _EventQueue2.default();
                var event = {
                    isImmediatePropagationStopped: function isImmediatePropagationStopped() {
                        return false;
                    }
                };
                var handlerA = function handlerA() {
                    event.isImmediatePropagationStopped = function () {
                        return true;
                    };
                };
                var handlerB = jasmine.createSpy('handlerB');
                queue.add(handlerA);
                queue.add(handlerB);
                queue.execute(event, null);
                expect(handlerB).not.toHaveBeenCalled();
            });

            it('should not execute duplicated handlers', function () {
                var queue = new _EventQueue2.default();
                var handler = jasmine.createSpy('handler');
                queue.add(handler);
                queue.add(handler);
                queue.execute({}, null);
                expect(handler.calls.count()).toBe(1);
            });

            it('should treated the same handler with different `thisObject` to be different', function () {
                var queue = new _EventQueue2.default();
                var handler = jasmine.createSpy('handler');
                queue.add(handler, { thisObject: { x: 1 } });
                queue.add(handler, { thisObject: { x: 2 } });
                queue.execute({}, null);
                expect(handler.calls.count()).toBe(2);
            });

            it('should not remove the handler if with different `thisObject`', function () {
                var queue = new _EventQueue2.default();
                var handler = jasmine.createSpy('handler');
                var x = { x: 1 };
                var y = { x: 2 };
                queue.add(handler, { thisObject: x });
                queue.add(handler, { thisObject: y });
                queue.remove(handler, x);
                queue.execute({}, null);
                expect(handler.calls.count()).toBe(1);
            });

            it('should not remove handlers with custom `thieObject` if `thisObject` is not given as a argument', function () {
                var queue = new _EventQueue2.default();
                var handler = jasmine.createSpy('handler');
                var x = { x: 1 };
                queue.add(handler, { thisObject: x });
                queue.add(handler);
                queue.remove(handler);
                queue.execute({}, null);
                expect(handler.calls.count()).toBe(1);
            });

            it('should treat a `false` handler as `preventDefault` & `stopPropagation`', function () {
                var queue = new _EventQueue2.default();
                queue.add(false);
                var event = {
                    preventDefault: jasmine.createSpy('preventDefault'),
                    stopPropagation: jasmine.createSpy('stopPropagation')
                };
                queue.execute(event);
                expect(event.preventDefault).toHaveBeenCalled();
                expect(event.stopPropagation).toHaveBeenCalled();
            });

            it('should be ok to remove a `false` handler', function () {
                var queue = new _EventQueue2.default();
                queue.add(false);
                queue.remove(false);
                var event = {
                    preventDefault: jasmine.createSpy('preventDefault'),
                    stopPropagation: jasmine.createSpy('stopPropagation')
                };
                queue.execute(event);
                expect(event.preventDefault).not.toHaveBeenCalled();
                expect(event.stopPropagation).not.toHaveBeenCalled();
            });

            it('should be safe to dispose the queue when executing, all remaining handlers should not be called', function () {
                var queue = new _EventQueue2.default();
                queue.add(function () {
                    queue.dispose();
                });
                var handler = jasmine.createSpy('handler');
                queue.add(handler);
                expect(function () {
                    queue.execute({});
                }).not.toThrow();
                expect(handler).not.toHaveBeenCalled();
            });
        });

        describe('`length` method', function () {
            it('should exists', function () {
                var queue = new _EventQueue2.default();
                expect(_typeof(queue.length)).toBe('function');
            });

            it('should have an alias method named `length`', function () {
                var queue = new _EventQueue2.default();
                expect(queue.length).toBe(queue.length);
            });

            it('should increment when an handler is added', function () {
                var queue = new _EventQueue2.default();
                queue.add(function () {});
                expect(queue.length()).toBe(1);
            });

            it('should increment when `false` is added as a handler', function () {
                var queue = new _EventQueue2.default();
                queue.add(false);
                expect(queue.length()).toBe(1);
            });

            it('should decrement when an handler is removed', function () {
                var queue = new _EventQueue2.default();
                var handler = function handler() {};
                queue.add(handler);
                queue.remove(handler);
                expect(queue.length()).toBe(0);
            });
        });
    });
});
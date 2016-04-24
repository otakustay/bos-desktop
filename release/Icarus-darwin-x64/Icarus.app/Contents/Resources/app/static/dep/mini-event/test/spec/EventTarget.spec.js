define(['Event', 'EventTarget'], function (_Event, _EventTarget) {
    'use strict';

    var _Event2 = _interopRequireDefault(_Event);

    var _EventTarget2 = _interopRequireDefault(_EventTarget);

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

    describe('EventTarget', function () {
        it('should be a construtor', function () {
            expect(typeof _EventTarget2.default === 'undefined' ? 'undefined' : _typeof(_EventTarget2.default)).toBe('function');
        });

        it('should be instantiable', function () {
            expect(_typeof(new _EventTarget2.default())).toBe('object');
        });

        describe('`on` method', function () {
            it('should exist', function () {
                var eventTarget = new _EventTarget2.default();
                expect(_typeof(eventTarget.on)).toBe('function');
            });

            it('should be safe to attach a handler for a named event', function () {
                var eventTarget = new _EventTarget2.default();
                expect(function () {
                    return eventTarget.on('change', function () {});
                }).not.toThrow();
            });

            it('should be safe to attach a global event handler', function () {
                var eventTarget = new _EventTarget2.default();
                expect(function () {
                    return eventTarget.on('*', function () {});
                }).not.toThrow();
            });

            it('should be safe to specify a `this` object', function () {
                var eventTarget = new _EventTarget2.default();
                var fn = function fn() {};
                expect(function () {
                    return eventTarget.on('change', fn, {});
                }).not.toThrow();
            });

            it('should be safe to specify a `options` object', function () {
                var eventTarget = new _EventTarget2.default();
                var fn = function fn() {};
                expect(function () {
                    return eventTarget.on('change', fn, {}, { once: true });
                }).not.toThrow();
            });
        });

        describe('`once` method', function () {
            it('should exist', function () {
                var eventTarget = new _EventTarget2.default();
                expect(_typeof(eventTarget.once)).toBe('function');
            });

            it('should be safe to attach a handler for a named event', function () {
                var eventTarget = new _EventTarget2.default();
                expect(function () {
                    return eventTarget.once('change', function () {});
                }).not.toThrow();
            });

            it('should be safe to specify a `this` object', function () {
                var eventTarget = new _EventTarget2.default();
                var fn = function fn() {};
                expect(function () {
                    return eventTarget.on('change', fn, {});
                }).not.toThrow();
            });

            it('should be safe to attach a global event handler', function () {
                var eventTarget = new _EventTarget2.default();
                expect(function () {
                    return eventTarget.once('*', function () {});
                }).not.toThrow();
            });

            it('should be safe to specify a `options` object', function () {
                var eventTarget = new _EventTarget2.default();
                var fn = function fn() {};
                expect(function () {
                    return eventTarget.on('change', fn, {}, { once: false });
                }).not.toThrow();
            });
        });

        describe('`un` method', function () {
            it('should exist', function () {
                var eventTarget = new _EventTarget2.default();
                expect(_typeof(eventTarget.un)).toBe('function');
            });

            it('should be safe to remove an attached handler', function () {
                var fn = function fn() {};
                var eventTarget = new _EventTarget2.default();
                eventTarget.on('change', fn);
                expect(function () {
                    return eventTarget.un('change', fn);
                }).not.toThrow();
            });

            it('should be safe to remove all event handlers by not providing a specified handler', function () {
                var fn = function fn() {};
                var eventTarget = new _EventTarget2.default();
                eventTarget.on('change', fn);
                expect(function () {
                    return eventTarget.un('change');
                }).not.toThrow();
            });

            it('should be safe to remove a non-attached handler', function () {
                var fn = function fn() {};
                var eventTarget = new _EventTarget2.default();
                expect(function () {
                    return eventTarget.un('change', fn);
                }).not.toThrow();
            });

            it('should be safe to remove a type of event with no handler initialized', function () {
                var eventTarget = new _EventTarget2.default();
                expect(function () {
                    return eventTarget.un('change');
                }).not.toThrow();
            });
        });

        describe('`fire` method', function () {
            it('should exist', function () {
                var eventTarget = new _EventTarget2.default();
                expect(_typeof(eventTarget.fire)).toBe('function');
            });

            it('should execute all named event handlers', function () {
                var eventTarget = new _EventTarget2.default();
                var handlerA = jasmine.createSpy('handlerA');
                var handlerB = jasmine.createSpy('handlerB');
                var handlerC = jasmine.createSpy('handlerC');
                eventTarget.on('change', handlerA);
                eventTarget.on('change', handlerB);
                eventTarget.on('change', handlerC);
                eventTarget.fire('change');
                expect(handlerA).toHaveBeenCalled();
                expect(handlerB).toHaveBeenCalled();
                expect(handlerC).toHaveBeenCalled();
            });

            it('should execute all global event handlers when any named event is fired', function () {
                var eventTarget = new _EventTarget2.default();
                var handlerA = jasmine.createSpy('handlerA');
                var handlerB = jasmine.createSpy('handlerB');
                var handlerC = jasmine.createSpy('handlerC');
                eventTarget.on('*', handlerA);
                eventTarget.on('*', handlerB);
                eventTarget.on('*', handlerC);
                eventTarget.fire('change');
                expect(handlerA).toHaveBeenCalled();
                expect(handlerB).toHaveBeenCalled();
                expect(handlerC).toHaveBeenCalled();
            });

            it('should be safe to fire an event with no handler initialized', function () {
                var eventTarget = new _EventTarget2.default();
                expect(function () {
                    return eventTarget.fire('change');
                }).not.toThrow();
            });

            it('should return a correctly built `Event` object', function () {
                var eventTarget = new _EventTarget2.default();
                var event = eventTarget.fire('change');
                expect(event instanceof _Event2.default).toBe(true);
                expect(event.type).toBe('change');
                expect(event.target).toBe(eventTarget);
            });

            it('should accept an `Event` object and then return this object itself', function () {
                var eventTarget = new _EventTarget2.default();
                var event = new _Event2.default();
                var returnedEvent = eventTarget.fire('change', event);
                expect(returnedEvent).toBe(event);
            });

            it('should accept any object as event\'s data', function () {
                var eventTarget = new _EventTarget2.default();
                var event = eventTarget.fire('change', { x: 1 });
                expect(event.x).toBe(1);
            });

            it('should accept any non-object value and extend it to event object as the `data` property', function () {
                var eventTarget = new _EventTarget2.default();
                var event = eventTarget.fire('change', 1);
                expect(event.data).toBe(1);
            });

            it('should accept only one object as arguments', function () {
                var eventTarget = new _EventTarget2.default();
                var event = eventTarget.fire({ type: 'change', x: 1 });
                expect(event.type).toBe('change');
                expect(event.x).toBe(1);
            });

            it('should pass the event object to handlers', function () {
                var eventTarget = new _EventTarget2.default();
                var handler = jasmine.createSpy('handler');
                eventTarget.on('change', handler);
                var event = eventTarget.fire('change');
                expect(handler.calls.mostRecent().args[0]).toBe(event);
            });

            it('should call handlers specified as `once` only once', function () {
                var eventTarget = new _EventTarget2.default();
                var handlerA = jasmine.createSpy('handlerA');
                var handlerB = jasmine.createSpy('handlerB');
                eventTarget.on('change', handlerA, null, { once: true });
                eventTarget.once('change', handlerB);
                eventTarget.fire('change');
                eventTarget.fire('change');
                expect(handlerA.calls.count()).toBe(1);
                expect(handlerB.calls.count()).toBe(1);
            });

            it('should pass the `thisObject` as handler\'s `this`', function () {
                var eventTarget = new _EventTarget2.default();
                var thisObject = {};
                var handlerA = jasmine.createSpy('handlerA');
                var handlerB = jasmine.createSpy('handlerB');
                eventTarget.on('change', handlerA, thisObject);
                eventTarget.on('change', handlerB, null, { thisObject: thisObject });
                eventTarget.fire('change');
                expect(handlerA.calls.mostRecent().object).toBe(thisObject);
                expect(handlerB.calls.mostRecent().object).toBe(thisObject);
            });

            it('should pass the EventTarget object itself as `this` if `thisObject` is given a null value', function () {
                var eventTarget = new _EventTarget2.default();
                var handlerA = jasmine.createSpy('handlerA');
                var handlerB = jasmine.createSpy('handlerB');
                eventTarget.on('change', handlerA, null);
                eventTarget.on('change', handlerB, undefined);
                eventTarget.fire('change');
                expect(handlerA.calls.mostRecent().object).toBe(eventTarget);
                expect(handlerB.calls.mostRecent().object).toBe(eventTarget);
            });

            it('should be safe to dispose itself when executing handlers, all remaining handlers should not be called', function () {
                var eventTarget = new _EventTarget2.default();
                eventTarget.on('change', function () {
                    return eventTarget.destroyEvents();
                });
                var handler = jasmine.createSpy('handler');
                eventTarget.on('change', handler);
                expect(function () {
                    return eventTarget.fire('change');
                }).not.toThrow();
                expect(handler).not.toHaveBeenCalled();
            });

            it('should not execute global event handlers (those registered with `*`) when disposed on executing', function () {
                var eventTarget = new _EventTarget2.default();
                eventTarget.on('change', function () {
                    return eventTarget.destroyEvents();
                });
                var handler = jasmine.createSpy('handler');
                eventTarget.on('*', handler);
                expect(function () {
                    return eventTarget.fire('change');
                }).not.toThrow();
                expect(handler).not.toHaveBeenCalled();
            });
        });

        describe('`destroyEvents` method', function () {
            it('should exist', function () {
                var eventTarget = new _EventTarget2.default();
                expect(_typeof(eventTarget.destroyEvents)).toBe('function');
            });

            it('should remove all events', function () {
                var eventTarget = new _EventTarget2.default();
                var handler = jasmine.createSpy('handler');
                eventTarget.on('change', handler);
                eventTarget.destroyEvents();
                eventTarget.fire('change');
                expect(handler).not.toHaveBeenCalled();
            });

            it('should works silently when no events are initialized', function () {
                var eventTarget = new _EventTarget2.default();
                expect(function () {
                    return eventTarget.destroyEvents();
                }).not.toThrow();
            });
        });
    });
});
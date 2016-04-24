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

    describe('Event', function () {
        it('should be a constructor', function () {
            expect(typeof _Event2.default === 'undefined' ? 'undefined' : _typeof(_Event2.default)).toBe('function');
        });

        it('should be instantiable', function () {
            expect(function () {
                return new _Event2.default();
            }).not.toThrow();
        });

        describe('constructor', function () {
            it('should accept no arguments to create an empty event object', function () {
                var event = new _Event2.default();
                expect(typeof event === 'undefined' ? 'undefined' : _typeof(event)).toBe('object');
                expect(event.type).toBeUndefined();
            });

            it('should accept a type', function () {
                var event = new _Event2.default('foo');
                expect(event.type).toBe('foo');
            });

            it('should accept an object and extend the object to itself', function () {
                var event = new _Event2.default({ type: 'foo', x: 1 });
                expect(event.type).toBe('foo');
                expect(event.x).toBe(1);
            });

            it('should accept both `type` and `args`, and `type` is more priorier', function () {
                var event = new _Event2.default('foo', { type: 'bar', x: 1 });
                expect(event.type).toBe('foo');
                expect(event.x).toBe(1);
            });
        });

        describe('`preventDefault` method', function () {
            it('should exists', function () {
                var event = new _Event2.default();
                expect(_typeof(event.preventDefault)).toBe('function');
            });

            it('should take effect when called', function () {
                var event = new _Event2.default();
                event.preventDefault();
                expect(event.isDefaultPrevented()).toBe(true);
            });
        });

        describe('`stopPropagation` method', function () {
            it('should exists', function () {
                var event = new _Event2.default();
                expect(_typeof(event.stopPropagation)).toBe('function');
            });

            it('should take effect when called', function () {
                var event = new _Event2.default();
                event.stopPropagation();
                expect(event.isPropagationStopped()).toBe(true);
            });
        });

        describe('`stopImmediatePropagation` method', function () {
            it('should exists', function () {
                var event = new _Event2.default();
                expect(_typeof(event.stopImmediatePropagation)).toBe('function');
            });

            it('should take effect when called', function () {
                var event = new _Event2.default();
                event.stopImmediatePropagation();
                expect(event.isImmediatePropagationStopped()).toBe(true);
            });
        });

        describe('`fromEvent` method', function () {
            it('should exists', function () {
                expect(_typeof(_Event2.default.fromEvent)).toBe('function');
            });

            it('should basically create an event object with the same `type` property', function () {
                var event = new _Event2.default('foo', { x: 1 });
                var newEvent = _Event2.default.fromEvent(event);
                expect(newEvent.type).toBe('foo');
                expect(newEvent.x).toBeUndefined();
            });

            it('should copy all data properties from old event object if `preserveData` is specified', function () {
                var event = new _Event2.default('foo', { x: 1 });
                var newEvent = _Event2.default.fromEvent(event, { preserveData: true });
                expect(newEvent.type).toBe('foo');
                expect(newEvent.x).toBe(1);
            });

            it('should sync states between 2 event objects, if `syncState` is specified', function () {
                var event = new _Event2.default('foo', { x: 1 });
                var newEvent = _Event2.default.fromEvent(event, { syncState: true });
                newEvent.stopPropagation();
                newEvent.preventDefault();
                newEvent.stopImmediatePropagation();
                expect(event.isPropagationStopped()).toBe(true);
                expect(event.isDefaultPrevented()).toBe(true);
                expect(event.isImmediatePropagationStopped()).toBe(true);
            });

            it('should extend the new event object if `extend` is specified', function () {
                var event = new _Event2.default('foo');
                var newEvent = _Event2.default.fromEvent(event, { extend: { x: 1 } });
                expect(newEvent.x).toBe(1);
            });
        });

        describe('`delegate` method', function () {
            it('should exists', function () {
                expect(_typeof(_Event2.default.delegate)).toBe('function');
            });

            it('should take no effect when source object does not support `fire` method', function () {
                var source = {};
                var target = {
                    fire: jasmine.createSpy('fire'),
                    on: jasmine.createSpy('on')
                };
                expect(function () {
                    return _Event2.default.delegate(source, target, 'foo');
                }).not.toThrow();
            });

            it('should take no effect when target object does not support `fire` method', function () {
                var source = { on: jasmine.createSpy('on') };
                var target = { on: jasmine.createSpy('on') };
                expect(function () {
                    return _Event2.default.delegate(source, target, 'foo');
                }).not.toThrow();
            });

            it('should take no effect when target object does not support `on` method', function () {
                var source = {};
                var target = {
                    fire: jasmine.createSpy('fire')
                };
                expect(function () {
                    return _Event2.default.delegate(source, target, 'foo');
                }).not.toThrow();
            });

            it('should delegate `type` from `source` to `target`', function () {
                var source = new _EventTarget2.default();
                var target = new _EventTarget2.default();
                spyOn(source, 'on').and.callThrough();
                spyOn(target, 'fire').and.callThrough();
                _Event2.default.delegate(source, target, 'foo');
                expect(source.on).toHaveBeenCalled();
                expect(source.on.calls.mostRecent().args[0]).toBe('foo');
                source.fire('foo');
                expect(target.fire).toHaveBeenCalled();
                expect(target.fire.calls.mostRecent().args[0]).toBe('foo');
            });

            it('should be able to delegate with custom event names', function () {
                var source = new _EventTarget2.default();
                var target = new _EventTarget2.default();
                spyOn(source, 'on').and.callThrough();
                spyOn(target, 'fire').and.callThrough();
                _Event2.default.delegate(source, 'foo', target, 'bar');
                source.fire('foo');
                expect(target.fire).toHaveBeenCalled();
                expect(target.fire.calls.mostRecent().args[0]).toBe('bar');
            });

            it('should preserve all data if `preserveData` is specified when delegate the same event', function () {
                var source = new _EventTarget2.default();
                var target = new _EventTarget2.default();
                spyOn(source, 'on').and.callThrough();
                spyOn(target, 'fire').and.callThrough();
                _Event2.default.delegate(source, target, 'foo', { preserveData: true });
                var event = { x: 1 };
                source.fire('foo', event);
                expect(target.fire).toHaveBeenCalled();
                expect(target.fire.calls.mostRecent().args[0]).toBe('foo');
                expect(target.fire.calls.mostRecent().args[1].x).toBe(1);
            });

            it('should preserve all data if `preserveData` is specified when delegate custom event', function () {
                var source = new _EventTarget2.default();
                var target = new _EventTarget2.default();
                spyOn(source, 'on').and.callThrough();
                spyOn(target, 'fire').and.callThrough();
                _Event2.default.delegate(source, 'foo', target, 'bar', { preserveData: true });
                var event = { x: 1 };
                source.fire('foo', event);
                expect(target.fire).toHaveBeenCalled();
                expect(target.fire.calls.mostRecent().args[0]).toBe('bar');
                expect(target.fire.calls.mostRecent().args[1].x).toBe(1);
            });

            it('should sync the state between 2 event objects `syncState` is specified when delegate the same event', function () {
                var source = new _EventTarget2.default();
                var target = new _EventTarget2.default();
                spyOn(source, 'on').and.callThrough();
                spyOn(target, 'fire').and.callThrough();
                var handler = function handler(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    event.stopImmediatePropagation();
                };
                target.on('foo', handler);
                _Event2.default.delegate(source, target, 'foo', { syncState: true });
                var event = source.fire('foo', { x: 1 });
                expect(target.fire).toHaveBeenCalled();
                expect(target.fire.calls.mostRecent().args[0]).toBe('foo');
                expect(event.isPropagationStopped()).toBe(true);
                expect(event.isDefaultPrevented()).toBe(true);
                expect(event.isImmediatePropagationStopped()).toBe(true);
            });

            it('should sync the state between 2 event objects `syncState` is specified when delegate custom event', function () {
                var source = new _EventTarget2.default();
                var target = new _EventTarget2.default();
                spyOn(source, 'on').and.callThrough();
                spyOn(target, 'fire').and.callThrough();
                var handler = function handler(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    event.stopImmediatePropagation();
                };
                target.on('bar', handler);
                _Event2.default.delegate(source, 'foo', target, 'bar', { syncState: true });
                var event = source.fire('foo', { x: 1 });
                expect(target.fire).toHaveBeenCalled();
                expect(target.fire.calls.mostRecent().args[0]).toBe('bar');
                expect(event.isPropagationStopped()).toBe(true);
                expect(event.isDefaultPrevented()).toBe(true);
                expect(event.isImmediatePropagationStopped()).toBe(true);
            });

            it('should reset `target` property to target object', function () {
                var source = new _EventTarget2.default();
                var target = new _EventTarget2.default();
                spyOn(source, 'on').and.callThrough();
                spyOn(target, 'fire').and.callThrough();
                var handler = function handler(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    event.stopImmediatePropagation();
                };
                target.on('bar', handler);
                _Event2.default.delegate(source, 'foo', target, 'bar', { syncState: true });
                source.fire('foo', { x: 1 });
                expect(target.fire).toHaveBeenCalled();
                expect(target.fire.calls.mostRecent().args[1].target).toBe(target);
            });

            it('should reset `type` property to target type if it is different from source type', function () {
                var source = new _EventTarget2.default();
                var target = new _EventTarget2.default();
                spyOn(source, 'on').and.callThrough();
                spyOn(target, 'fire').and.callThrough();
                var handler = function handler(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    event.stopImmediatePropagation();
                };
                target.on('bar', handler);
                _Event2.default.delegate(source, 'foo', target, 'bar', { syncState: true });
                source.fire('foo', { x: 1 });
                expect(target.fire).toHaveBeenCalled();
                expect(target.fire.calls.mostRecent().args[1].type).toBe('bar');
            });
        });
    });
});
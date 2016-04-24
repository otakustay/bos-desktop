define(['exports', './Event', './EventQueue'], function (exports, _Event, _EventQueue) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _Event2 = _interopRequireDefault(_Event);

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

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var EVENT_POOL = Symbol('eventPool');

    /**
     * 提供事件相关操作的基类
     *
     * 可以让某个类继承此类，获得事件的相关功能：
     *
     * ```js
     * function MyClass() {
     *     // 此处可以不调用EventTarget构造函数
     * }
     *
     * inherits(MyClass, EventTarget);
     *
     * let instance = new MyClass();
     * instance.on('foo', executeFoo);
     * instance.fire('foo', { bar: 'Hello World' });
     * ```
     *
     * 当然也可以使用`Object.create`方法：
     *
     * ```js
     * let instance = Object.create(EventTarget.prototype);
     * instance.on('foo', executeFoo);
     * instance.fire('foo', { bar: 'Hello World' });
     * ```
     *
     * 还可以使用`enable`方法让一个静态的对象拥有事件功能：
     *
     * ```js
     * let instance = {}
     * EventTarget.enable(instance);
     *
     * // 同样可以使用事件
     * instance.on('foo', executeFoo);
     * instance.fire('foo', { bar: 'Hello World' });
     * ```
     */

    var EventTarget = function () {
        function EventTarget() {
            _classCallCheck(this, EventTarget);
        }

        _createClass(EventTarget, [{
            key: 'on',
            value: function on(type, fn, thisObject, options) {
                if (!this[EVENT_POOL]) {
                    this[EVENT_POOL] = {};
                }

                if (!this[EVENT_POOL].hasOwnProperty(type)) {
                    this[EVENT_POOL][type] = new _EventQueue2.default();
                }

                var queue = this[EVENT_POOL][type];

                options = Object.assign({}, options);
                if (thisObject) {
                    options.thisObject = thisObject;
                }

                queue.add(fn, options);
            }
        }, {
            key: 'once',
            value: function once(type, fn, thisObject, options) {
                options = Object.assign({}, options);
                options.once = true;
                this.on(type, fn, thisObject, options);
            }
        }, {
            key: 'un',
            value: function un(type, handler, thisObject) {
                if (!this[EVENT_POOL] || !this[EVENT_POOL].hasOwnProperty(type)) {
                    return;
                }

                var queue = this[EVENT_POOL][type];
                queue.remove(handler, thisObject);
            }
        }, {
            key: 'fire',
            value: function fire(type, args) {
                // 只提供一个对象作为参数，则是`.fire(args)`的形式，需要加上type
                if (arguments.length === 1 && (typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object') {
                    args = type;
                    type = args.type;
                }

                if (!type) {
                    throw new Error('No event type specified');
                }

                if (type === '*') {
                    throw new Error('Cannot fire global event');
                }

                var event = args instanceof _Event2.default ? args : new _Event2.default(type, args);
                event.target = this;

                // 在此处可能没有[EVENT_POOL]`，这是指对象整个就没初始化，
                // 即一个事件也没注册过就`fire`了，这是正常现象
                if (this[EVENT_POOL] && this[EVENT_POOL].hasOwnProperty(type)) {
                    var queue = this[EVENT_POOL][type];
                    queue.execute(event, this);
                }

                // 同时也有可能在上面执行标准事件队列的时候，把这个`EventTarget`给销毁了，
                // 此时[EVENT_POOL]`就没了，这种情况是正常的不能抛异常，要特别处理
                if (this[EVENT_POOL] && this[EVENT_POOL].hasOwnProperty('*')) {
                    var globalQueue = this[EVENT_POOL]['*'];
                    globalQueue.execute(event, this);
                }

                return event;
            }
        }, {
            key: 'destroyEvents',
            value: function destroyEvents() {
                if (!this[EVENT_POOL]) {
                    return;
                }

                for (var name in this[EVENT_POOL]) {
                    if (this[EVENT_POOL].hasOwnProperty(name)) {
                        this[EVENT_POOL][name].dispose();
                    }
                }

                this[EVENT_POOL] = null;
            }
        }]);

        return EventTarget;
    }();

    exports.default = EventTarget;
});
define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

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

    /**
     * mini-event
     * Copyright 2013 Baidu Inc. All rights reserved.
     *
     * @ignore
     * @file 事件对象类
     * @author otakustay
     */

    var isObject = function isObject(target) {
        return Object.prototype.toString.call(target) === '[object Object]';
    };

    // 复制事件属性的时候不复制这几个
    var EVENT_PROPERTY_BLACK_LIST = new Set(['type', 'target', 'preventDefault', 'isDefaultPrevented', 'stopPropagation', 'isPropagationStopped', 'stopImmediatePropagation', 'isImmediatePropagationStopped']);

    /**
     * 事件对象类
     */

    var Event = function () {

        /**
         * 构造函数
         *
         * 3个重载：
         *      - `new Event(type)`
         *      - `new Event(args)`
         *      - `new Event(type, args)`
         * 只提供一个对象作为参数，则是`new Event(args)`的形式，需要加上type
         *
         * @param {string | *} [type] 事件类型
         * @param {*} [args] 事件中的数据，如果为对象则将参数扩展到`Event`实例上。如果参数是非对象类型，则作为实例的`data`属性使用
         */

        function Event(type, args) {
            _classCallCheck(this, Event);

            // 如果第1个参数是对象，则就当是`new Event(args)`形式
            if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object') {
                args = type;
                type = args.type;
            }

            if (isObject(args)) {
                Object.assign(this, args);
            } else if (args) {
                this.data = args;
            }

            if (type) {
                this.type = type;
            }
        }

        /**
         * 判断默认行为是否已被阻止
         *
         * @return {boolean}
         */


        _createClass(Event, [{
            key: 'isDefaultPrevented',
            value: function isDefaultPrevented() {
                return false;
            }
        }, {
            key: 'preventDefault',
            value: function preventDefault() {
                this.isDefaultPrevented = function () {
                    return true;
                };
            }
        }, {
            key: 'isPropagationStopped',
            value: function isPropagationStopped() {
                return false;
            }
        }, {
            key: 'stopPropagation',
            value: function stopPropagation() {
                this.isPropagationStopped = function () {
                    return true;
                };
            }
        }, {
            key: 'isImmediatePropagationStopped',
            value: function isImmediatePropagationStopped() {
                return false;
            }
        }, {
            key: 'stopImmediatePropagation',
            value: function stopImmediatePropagation() {
                this.isImmediatePropagationStopped = function () {
                    return true;
                };

                this.stopPropagation();
            }
        }], [{
            key: 'fromEvent',
            value: function fromEvent(originalEvent, options) {
                var defaults = {
                    type: originalEvent.type,
                    preserveData: false,
                    syncState: false
                };
                options = Object.assign(defaults, options);

                var newEvent = new Event(options.type);
                // 如果保留数据，则把数据复制过去
                if (options.preserveData) {
                    // 要去掉一些可能出现的杂质，因此不用`lib.extend`
                    for (var key in originalEvent) {
                        if (originalEvent.hasOwnProperty(key) && !EVENT_PROPERTY_BLACK_LIST.has(key)) {
                            newEvent[key] = originalEvent[key];
                        }
                    }
                }

                // 如果有扩展属性，加上去
                if (options.extend) {
                    Object.assign(newEvent, options.extend);
                }

                // 如果要同步状态，把和状态相关的方法挂接上
                if (options.syncState) {
                    (function () {
                        var preventDefault = newEvent.preventDefault;
                        newEvent.preventDefault = function () {
                            originalEvent.preventDefault();

                            preventDefault.call(this);
                        };

                        var stopPropagation = originalEvent.stopPropagation;
                        newEvent.stopPropagation = function () {
                            originalEvent.stopPropagation();

                            stopPropagation.call(this);
                        };

                        var stopImmediatePropagation = originalEvent.stopImmediatePropagation;
                        newEvent.stopImmediatePropagation = function () {
                            originalEvent.stopImmediatePropagation();

                            stopImmediatePropagation.call(this);
                        };
                    })();
                }

                return newEvent;
            }
        }, {
            key: 'delegate',
            value: function delegate(from, fromType, to, toType, options) {
                // 重载：
                //
                // 1. `.delegate(from, fromType, to, toType)`
                // 2. `.delegate(from, fromType, to, toType, options)`
                // 3. `.delegate(from, to, type)`
                // 4. `.delegate(from, to, type, options)

                // 重点在于第2个参数的类型，如果为字符串则肯定是1或2，否则为3或4
                var useDifferentType = typeof fromType === 'string';
                var source = {
                    object: from,
                    type: useDifferentType ? fromType : to
                };
                var target = {
                    object: useDifferentType ? to : fromType,
                    type: useDifferentType ? toType : to
                };
                var config = useDifferentType ? options : toType;
                config = Object.assign({ preserveData: false }, config);

                // 如果提供方不能注册事件，或接收方不能触发事件，那就不用玩了
                if (typeof source.object.on !== 'function' || typeof target.object.on !== 'function' || typeof target.object.fire !== 'function') {
                    return;
                }

                var delegator = function delegator(originalEvent) {
                    var event = Event.fromEvent(originalEvent, config);
                    // 修正`type`和`target`属性
                    event.type = target.type;
                    event.target = target.object;

                    target.object.fire(target.type, event);
                };

                source.object.on(source.type, delegator);
            }
        }]);

        return Event;
    }();

    exports.default = Event;
});
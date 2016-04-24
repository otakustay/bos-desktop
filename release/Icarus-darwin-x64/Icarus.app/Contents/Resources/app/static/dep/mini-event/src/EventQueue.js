define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

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
     * @file 事件队列
     * @author otakustay
     */

    var QUEUE = Symbol('queue');

    /**
     * 判断已有的一个事件上下文对象是否和提供的参数等同
     *
     * @param {Object} context 在队列中已有的事件上下文对象
     * @param {Function | boolean} handler 处理函数，可以是`false`
     * @param {Mixed} [thisObject] 处理函数的`this`对象
     * @return {boolean}
     * @ignore
     */
    var isContextIdentical = function isContextIdentical(context, handler, thisObject) {
        // `thisObject`为`null`和`undefined`时认为等同，所以用`==`
        /* eslint-disable eqeqeq */
        return context && context.handler === handler && context.thisObject == thisObject;
        /* eslint-enable eqeqeq */
    };

    /**
     * 事件队列
     *
     * @constructor
     */

    var EventQueue = function () {
        function EventQueue() {
            _classCallCheck(this, EventQueue);

            this[QUEUE] = [];
        }

        /**
         * 添加一个事件处理函数
         *
         * @param {Function | boolean} handler 处理函数，
         * 可以传递`false`作为特殊的处理函数，参考{@link EventTarget#on}
         * @param {Object} [options] 相关配置
         * @param {Mixed} [options.thisObject] 执行处理函数时的`this`对象
         * @param {boolean} [options.once=false] 设定函数仅执行一次
         */


        _createClass(EventQueue, [{
            key: 'add',
            value: function add(handler, options) {
                if (handler !== false && typeof handler !== 'function') {
                    throw new Error('event handler must be a function or const false');
                }

                var wrapper = Object.assign({ handler: handler }, options);

                for (var i = 0; i < this[QUEUE].length; i++) {
                    var context = this[QUEUE][i];
                    // 同样的处理函数，不同的`this`对象，相当于外面`bind`了一把再添加，
                    // 此时认为这是完全不同的2个处理函数，但`null`和`undefined`认为是一样的
                    if (isContextIdentical(context, handler, wrapper.thisObject)) {
                        return;
                    }
                }

                this[QUEUE].push(wrapper);
            }
        }, {
            key: 'remove',
            value: function remove(handler, thisObject) {
                // 如果没提供`handler`，则直接清空
                if (!handler) {
                    this.clear();
                    return;
                }

                for (var i = 0; i < this[QUEUE].length; i++) {
                    var context = this[QUEUE][i];

                    if (isContextIdentical(context, handler, thisObject)) {
                        // 为了让`execute`过程中调用的`remove`工作正常，
                        // 这里不能用`splice`直接删除，仅设为`null`留下这个空间
                        this[QUEUE][i] = null;

                        // 完全符合条件的处理函数在`add`时会去重，因此这里肯定只有一个
                        return;
                    }
                }
            }
        }, {
            key: 'clear',
            value: function clear() {
                this[QUEUE].length = 0;
            }
        }, {
            key: 'execute',
            value: function execute(event, thisObject) {
                // 如果执行过程中销毁，`dispose`会把`this[QUEUE]`弄掉，所以这里留一个引用，
                // 在`dispose`中会额外把数组清空，因此不用担心后续的函数会执行
                var queue = this[QUEUE];
                for (var i = 0; i < queue.length; i++) {
                    if (typeof event.isImmediatePropagationStopped === 'function' && event.isImmediatePropagationStopped()) {
                        return;
                    }

                    var context = queue[i];

                    // 移除事件时设置为`null`，因此可能无值
                    if (!context) {
                        continue;
                    }

                    var handler = context.handler;

                    // `false`等同于两个方法的调用
                    if (handler === false) {
                        if (typeof event.preventDefault === 'function') {
                            event.preventDefault();
                        }
                        if (typeof event.stopPropagation === 'function') {
                            event.stopPropagation();
                        }
                    } else {
                        // 这里不需要做去重处理了，在`on`的时候会去重，因此这里不可能重复
                        handler.call(context.thisObject || thisObject, event);
                    }

                    if (context.once) {
                        this.remove(context.handler, context.thisObject);
                    }
                }
            }
        }, {
            key: 'length',
            value: function length() {
                return this[QUEUE].filter(function (item) {
                    return !!item;
                }).length;
            }
        }, {
            key: 'dispose',
            value: function dispose() {
                // 在执行过程中被销毁的情况下，这里`length`置为0，循环就走不下去了
                this.clear();
                this[QUEUE] = null;
            }
        }]);

        return EventQueue;
    }();

    exports.default = EventQueue;
});
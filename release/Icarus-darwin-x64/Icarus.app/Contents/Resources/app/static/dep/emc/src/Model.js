define(['exports', 'diffy-update', 'diffy-update/merge', 'diffy-update/diffNode', 'mini-event/EventTarget'], function (exports, _diffyUpdate, _merge, _diffNode, _EventTarget2) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _EventTarget3 = _interopRequireDefault(_EventTarget2);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }

        return obj;
    }

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

    var EMPTY = {};

    var STORE = Symbol('store');
    var COMPUTED_PROPERTIES = Symbol('computedProperties');
    var DIFF = Symbol('diff');
    var OLD_VALUES = Symbol('oldValues');
    var SUPRESS_COMPUTED_PROPERTY_CHANGE_MUTEX = Symbol('supressComputedPropertyChangeMutex');
    var IS_UPDATE_NOTIFICATION_IN_QUEUE = Symbol('asyncTick');
    var HAS_PROPERTY = Symbol('hasProperty');
    var HAS_COMPUTED_PROPERTY = Symbol('hasComputedProperty');
    var SET_COMPUTED_PROPERTY = Symbol('setComputedProperty');
    var UPDATE_COMPUTED_PROPERTY = Symbol('updateComputedProperty');
    var UPDATE_COMPUTED_PROPERTIES_FROM_DEPENDENCY = Symbol('updateComputedPropertiesFromDependency');
    var SET_VALUE = Symbol('setValue');
    var ASSIGN_VALUE = Symbol('assignValue');
    var MERGE_UPDATE_DIFF = Symbol('mergeUpdateDiff');
    var SCHEDULE_UPDATE_EVENT = Symbol('scheduleUpdateEvent');

    var async = typeof setImmediate === 'undefined' ? function (task) {
        return setTimeout(task, 0);
    } : function (task) {
        return setImmediate(task);
    };

    var clone = function clone(target) {
        if (!target) {
            return target;
        }

        return Object.entries(target).reduce(function (result, _ref) {
            var _ref2 = _slicedToArray(_ref, 2);

            var key = _ref2[0];
            var value = _ref2[1];

            result[key] = value;
            return result;
        }, {});
    };

    var isEmpty = function isEmpty(target) {
        for (var key in target) {
            if (target.hasOwnProperty(key)) {
                return false;
            }
        }

        return true;
    };

    /**
     * 数据模型类，用于表达一个数据集，同时提供数据变更的通知功能
     *
     * @extends mini-event.EventTarget
     *
     * @param {Object} [initialData] 初始化数据
     */

    var Model = function (_EventTarget) {
        _inherits(Model, _EventTarget);

        function Model(initialData) {
            _classCallCheck(this, Model);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Model).call(this));

            _this[STORE] = clone(initialData) || {};
            _this[COMPUTED_PROPERTIES] = {};
            _this[IS_UPDATE_NOTIFICATION_IN_QUEUE] = false;
            _this[SUPRESS_COMPUTED_PROPERTY_CHANGE_MUTEX] = 0;
            _this[DIFF] = {};
            _this[OLD_VALUES] = {};
            return _this;
        }

        /**
         * 获取指定属性的值
         *
         *
         * @param {string} name 属性名
         * @return {*} 属性值
         *
         * @throws {Error} 当前实例已经销毁了
         * @throws {Error} 未提供`name`参数
         */


        _createClass(Model, [{
            key: 'get',
            value: function get(name) {
                if (!this[STORE]) {
                    throw new Error('This model is disposed');
                }

                if (!name) {
                    throw new Error('Argument name is not provided');
                }

                if (this[STORE].hasOwnProperty(name)) {
                    return this[STORE][name];
                } else if (this[HAS_COMPUTED_PROPERTY](name)) {
                    var
                    // 如果`evaluate`选项为`false`，则延迟计算属性的取值（默认行为）
                    get = this[COMPUTED_PROPERTIES][name].get;

                    var value = get.call(this);
                    this[STORE][name] = value;
                    return value;
                }

                return undefined;
            }
        }, {
            key: 'set',
            value: function set(name, value) {
                var options = arguments.length <= 2 || arguments[2] === undefined ? EMPTY : arguments[2];

                if (!this[STORE]) {
                    throw new Error('This model is disposed');
                }

                if (!name) {
                    throw new Error('Argument name is not provided');
                }

                if (this[HAS_COMPUTED_PROPERTY](name)) {
                    this[SET_COMPUTED_PROPERTY](name, value, options);
                } else {
                    this[SET_VALUE](name, value, options);
                }
            }
        }, {
            key: 'remove',
            value: function remove(name) {
                var options = arguments.length <= 1 || arguments[1] === undefined ? EMPTY : arguments[1];

                if (!this[STORE]) {
                    throw new Error('This model is disposed');
                }

                if (!name) {
                    throw new Error('Argument name is not provided');
                }

                // 如果本来就没这属性，就提前退出
                if (!this.has(name)) {
                    return;
                }

                var oldValue = this[STORE][name];

                if (!options.silent) {
                    var eventData = {
                        name: name,
                        changeType: 'remove',
                        oldValue: oldValue,
                        newValue: undefined
                    };
                    var event = this.fire('beforechange', eventData);
                    if (!event.isDefaultPrevented()) {
                        this[ASSIGN_VALUE](name, undefined, 'remove', options);
                    }
                }
            }
        }, {
            key: 'update',
            value: function update(commands) {
                var options = arguments.length <= 1 || arguments[1] === undefined ? EMPTY : arguments[1];

                if (!commands) {
                    throw new Error('Argument commands is not provided');
                }

                this[SUPRESS_COMPUTED_PROPERTY_CHANGE_MUTEX]++;
                // 禁止根属性的修改，不然会直接把`STORE`给改掉
                var updatingProperties = Object.keys(commands);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = updatingProperties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var name = _step.value;

                        var currentValue = this[STORE][name];

                        var _update2 = (0, _diffyUpdate.withDiff)(currentValue, commands[name]);

                        var _update3 = _slicedToArray(_update2, 2);

                        var newValue = _update3[0];
                        var diff = _update3[1];

                        this[SET_VALUE](name, newValue, options, diff);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                this[SUPRESS_COMPUTED_PROPERTY_CHANGE_MUTEX]--;
                this[UPDATE_COMPUTED_PROPERTIES_FROM_DEPENDENCY](updatingProperties);
            }
        }, {
            key: 'dump',
            value: function dump() {
                // 用浅复制避免外部修改导出的对象影响实例
                return clone(this[STORE]) || {};
            }
        }, {
            key: 'has',
            value: function has(name) {
                if (!name) {
                    throw new Error('Argument name is not provided');
                }

                if (!this[STORE]) {
                    return false;
                }

                return this[HAS_PROPERTY](name);
            }
        }, {
            key: 'hasValue',
            value: function hasValue(name) {
                if (!name) {
                    throw new Error('Argument name is not provided');
                }

                if (!this[STORE]) {
                    return false;
                }

                // 这里不用`this.get`，免得子类重写了`get`后导致判断出问题
                return this.has(name) && this[STORE][name] != null;
            }
        }, {
            key: 'hasReadableValue',
            value: function hasReadableValue(name) {
                if (!name) {
                    throw new Error('Argument name is not provided');
                }

                if (!this[STORE]) {
                    return false;
                }

                return this.hasValue(name) && this[STORE][name] !== '';
            }
        }, {
            key: 'defineComputedProperty',
            value: function defineComputedProperty(name, dependencies, accessorOrGetter) {
                var _this2 = this;

                var descriptor = typeof accessorOrGetter === 'function' ? { get: accessorOrGetter } : clone(accessorOrGetter);
                descriptor.name = name;
                descriptor.dependencies = dependencies;
                descriptor.dependencySet = new Set(dependencies);
                descriptor.evaluate = descriptor.evaluate || false;

                // 监听依赖的变化来重新计算
                this.on('change', function (e) {
                    if (_this2[SUPRESS_COMPUTED_PROPERTY_CHANGE_MUTEX]) {
                        return;
                    }

                    if (descriptor.dependencySet.has(e.name)) {
                        _this2[UPDATE_COMPUTED_PROPERTY](name);
                    }
                });

                this[COMPUTED_PROPERTIES][name] = descriptor;
                // 如果要求立即计算，那么计算后存下来，因为是初始值，所以这个不会影响内部存储的差异集的
                if (descriptor.evaluate) {
                    this[STORE][name] = descriptor.get.call(this);
                }
            }
        }, {
            key: 'dispose',
            value: function dispose() {
                this.destroyEvents();
                this[STORE] = null;
                this[DIFF] = null;
                this[OLD_VALUES] = null;
                this[IS_UPDATE_NOTIFICATION_IN_QUEUE] = false;
            }
        }, {
            key: HAS_PROPERTY,
            value: function value(name) {
                return this[STORE].hasOwnProperty(name) || this[HAS_COMPUTED_PROPERTY](name);
            }
        }, {
            key: HAS_COMPUTED_PROPERTY,
            value: function value(name) {
                return this[COMPUTED_PROPERTIES].hasOwnProperty(name);
            }
        }, {
            key: SET_COMPUTED_PROPERTY,
            value: function value(name, _value, options) {
                var _COMPUTED_PROPERTIES$ = this[COMPUTED_PROPERTIES][name];
                var set = _COMPUTED_PROPERTIES$.set;
                var dependencies = _COMPUTED_PROPERTIES$.dependencies;


                if (!set) {
                    throw new Error('Cannot set readonly computed property ' + name);
                }

                this[SUPRESS_COMPUTED_PROPERTY_CHANGE_MUTEX]++;
                set.call(this, _value, options);
                this[SUPRESS_COMPUTED_PROPERTY_CHANGE_MUTEX]--;
                this[UPDATE_COMPUTED_PROPERTIES_FROM_DEPENDENCY](dependencies);
            }
        }, {
            key: UPDATE_COMPUTED_PROPERTY,
            value: function value(name) {
                var options = arguments.length <= 1 || arguments[1] === undefined ? EMPTY : arguments[1];
                var get = this[COMPUTED_PROPERTIES][name].get;

                var newValue = get.call(this);
                this[SET_VALUE](name, newValue, Object.assign({ disableHook: true }, options));
            }
        }, {
            key: UPDATE_COMPUTED_PROPERTIES_FROM_DEPENDENCY,
            value: function value(dependencies) {
                var _this3 = this;

                var updatingProperties = dependencies.reduce(function (result, propertyName) {
                    var dependentComputedProperties = Object.values(_this3[COMPUTED_PROPERTIES]).filter(function (descriptor) {
                        return descriptor.dependencySet.has(propertyName);
                    }).map(function (descriptor) {
                        return descriptor.name;
                    });
                    dependentComputedProperties.forEach(result.add.bind(result));
                    return result;
                }, new Set());
                updatingProperties.forEach(this[UPDATE_COMPUTED_PROPERTY].bind(this));
            }
        }, {
            key: SET_VALUE,
            value: function value(name, _value2, options, diff) {
                var oldValue = this[STORE][name];
                var isValueChanged = !this.has(name) || oldValue !== _value2;
                if (!isValueChanged) {
                    return;
                }

                // 计算属性无论是不是立即求值的，我们都当它有个初始值，所以懒求值的计算属性第一次变化时旧值就是`undefined`了
                var changeType = this[HAS_PROPERTY](name) ? 'change' : 'add';

                if (options.silent || options.disableHook) {
                    this[ASSIGN_VALUE](name, _value2, changeType, options, diff);
                    return;
                }

                var eventData = {
                    name: name,
                    changeType: changeType,
                    oldValue: oldValue,
                    newValue: _value2,
                    actualValue: _value2,
                    diff: diff
                };

                /**
                 * 在属性值变化前一刻触发
                 *
                 * `beforechange`事件会由`set`和`update`方法触发，当使用`update`方法时，每个更新的属性都会触发一次该事件
                 *
                 * 如果事件由`update`触发，那么事件对象上会提供一个`diff`属性表达更新的差异
                 *
                 * 在该事件的处理函数中，可以使用`event.preventDefault()`来阻止后续的属性赋值，阻止后`change`事件就不会触发了
                 *
                 * 同时还可以修改`event.actualValue`值来改变实际赋予属性的值，如果`actualValue`被改变了，那么`diff`属性就会失效
                 *
                 * @event Model#beforechange
                 *
                 * @property {string} name 属性名
                 * @property {string} changeType 变化的类型，可以为`"add"`、`"change"`或`"remove"`
                 * @property {*} oldValue 属性的旧值
                 * @property {*} newValue 属性的新值
                 * @property {Object} [diff] 属性变化的差异对象
                 * @property {*} actualValue 实际赋予属性的值，修改这个属性可以改变最后的赋值内容
                 */
                var event = this.fire('beforechange', eventData);

                if (!event.isDefaultPrevented()) {
                    // Discard diff if `actualValue` is changed in event handlers.
                    var actualDiff = event.actualValue === _value2 ? diff : undefined;
                    this[ASSIGN_VALUE](name, event.actualValue, event.changeType, options, actualDiff);
                }
            }
        }, {
            key: ASSIGN_VALUE,
            value: function value(name, newValue, changeType, options, diff) {
                var oldValue = this[STORE][name];

                if (changeType === 'change' && newValue === oldValue) {
                    return;
                }

                if (!this[OLD_VALUES].hasOwnProperty(name)) {
                    this[OLD_VALUES][name] = this[STORE][name];
                }

                if (changeType === 'remove') {
                    // Method such like `underscore.omit` has a complexity of O(n),
                    // since the `store` object is an internal object just owned by model,
                    // we use `delete` operator here to gain a little performance boost
                    delete this[STORE][name];
                } else {
                    this[STORE][name] = newValue;
                }

                var mergingDiff = _defineProperty({}, name, diff || (0, _diffNode.createDiffNode)(changeType, oldValue, newValue));
                this[MERGE_UPDATE_DIFF](mergingDiff);

                if (!options.silent) {
                    var eventData = { name: name, changeType: changeType, oldValue: oldValue, newValue: newValue, diff: diff };
                    /**
                     * Fires after a property changes its value.
                     *
                     * @event change
                     *
                     * @property {string} name 属性名
                     * @property {string} changeType 变化的类型，可以为`"add"`、`"change"`或`"remove"`
                     * @property {*} oldValue 属性的旧值
                     * @property {*} newValue 属性的新值
                     * @property {Object} [diff] A diff between the old and new value, only available for `update` method.
                     */
                    this.fire('change', eventData);
                }
            }
        }, {
            key: SCHEDULE_UPDATE_EVENT,
            value: function value() {
                var _this4 = this;

                if (this[IS_UPDATE_NOTIFICATION_IN_QUEUE]) {
                    return;
                }

                var update = function update() {
                    // 如果实例已经销毁就算了
                    if (_this4[STORE]) {
                        // 如果确实有差异就触发`update`事件，没差异就没事件
                        if (!isEmpty(_this4[DIFF])) {
                            /**
                             * 在属性变化后异步触发
                             *
                             * 这个事件是异步触发的，所以一个事件循环内所有的数据修改都会收集在一起，并合并成一个差异对象
                             *
                             * @property {Object} [diff] 一个事件循环内产生的差异对象
                             */
                            _this4.fire('update', { diff: _this4[DIFF] });
                        }
                        _this4[DIFF] = {};
                        _this4[OLD_VALUES] = {};
                        _this4[IS_UPDATE_NOTIFICATION_IN_QUEUE] = false;
                    }
                };
                async(update);
                this[IS_UPDATE_NOTIFICATION_IN_QUEUE] = true;
            }
        }, {
            key: MERGE_UPDATE_DIFF,
            value: function value(diff) {
                (0, _merge.mergeDiff)(this[DIFF], diff, this[OLD_VALUES], this[STORE]);
                this[SCHEDULE_UPDATE_EVENT]();
            }
        }]);

        return Model;
    }(_EventTarget3.default);

    exports.default = Model;
});
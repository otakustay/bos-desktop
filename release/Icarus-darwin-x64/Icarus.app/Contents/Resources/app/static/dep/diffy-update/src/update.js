define(['exports', './diffNode'], function (exports, _diffNode) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.isDiffNode = undefined;
    Object.defineProperty(exports, 'isDiffNode', {
        enumerable: true,
        get: function () {
            return _diffNode.isDiffNode;
        }
    });
    exports.withDiff = withDiff;
    exports.default = update;
    exports.set = set;
    exports.push = push;
    exports.unshift = unshift;
    exports.merge = merge;
    exports.defaults = defaults;
    exports.invoke = invoke;

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

    var clone = function clone(target) {
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

    var pick = function pick(target, keys) {
        return keys.reduce(function (result, key) {
            result[key] = target[key];
            return result;
        }, {});
    };

    var AVAILABLE_COMMANDS = {
        $set: function $set(container, propertyName, newValue) {
            var oldValue = container[propertyName];
            if (newValue === oldValue) {
                return [oldValue, null];
            }
            return [newValue, (0, _diffNode.createDiffNode)(container.hasOwnProperty(propertyName) ? 'change' : 'add', oldValue, newValue)];
        },
        $push: function $push(container, propertyName, newValue) {
            var array = container[propertyName];
            var result = array.slice();
            result.push(newValue);
            return [result, (0, _diffNode.createDiffNode)('change', array, result)];
        },
        $unshift: function $unshift(container, propertyName, newValue) {
            var array = container[propertyName];
            var result = array.slice();
            result.unshift(newValue);
            return [result, (0, _diffNode.createDiffNode)('change', array, result)];
        },
        $merge: function $merge(container, propertyName, extensions) {
            var target = container[propertyName];
            if (target == null) {
                var _newValue = clone(extensions);
                return [_newValue, (0, _diffNode.createDiffNode)(container.hasOwnProperty(propertyName) ? 'change' : 'add', target, _newValue)];
            }

            var diff = {};
            var newValue = clone(target);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(extensions)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    var _AVAILABLE_COMMANDS$$ = AVAILABLE_COMMANDS.$set(newValue, key, extensions[key]);

                    var _AVAILABLE_COMMANDS$$2 = _slicedToArray(_AVAILABLE_COMMANDS$$, 2);

                    var propertyValue = _AVAILABLE_COMMANDS$$2[0];
                    var propertyDiff = _AVAILABLE_COMMANDS$$2[1];

                    if (propertyDiff) {
                        diff[key] = propertyDiff;
                        newValue[key] = propertyValue;
                    }
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

            if (isEmpty(diff)) {
                diff = null;
            }
            return [newValue, diff];
        },
        $defaults: function $defaults(container, propertyName, defaults) {
            var target = container[propertyName];
            var overrideKeys = Object.keys(defaults).filter(function (key) {
                return target[key] === undefined;
            });
            var extensions = pick(defaults, overrideKeys);
            return AVAILABLE_COMMANDS.$merge(container, propertyName, extensions);
        },
        $invoke: function $invoke(container, propertyName, factory) {
            var newValue = factory(container[propertyName]);
            return AVAILABLE_COMMANDS.$set(container, propertyName, newValue);
        }
    };

    /**
     * 根据提供的指令更新一个对象，返回更新后的新对象以及新旧对象的差异（diff），原对象不会作任何的修改
     *
     * 现有支持的指令包括：
     *
     * - `$set`：修改指定的属性值
     * - `$push`：向类型为数组的属性尾部添加元素
     * - `$unshift`：向类型为数组的属性头部添加元素
     * - `$merge`：将2个对象进行浅合并（不递归）
     * - `$defaults`：将指定对象的属性值填到原属性为`undefined`的属性上
     * - `$invoke`：用一个工厂函数的返回值作为`$set`指令的输入，工厂函数接受属性的旧值作为唯一的参数
     *
     * 可以在一次更新操作中对不同的属性用不同的指令：
     *
     * ```javascript
     * import {withDiff} from 'diffy-update';
     *
     * let [newObject, diff] = withDiff(
     *     source,
     *     {
     *         foo: {bar: {$set: 1}},
     *         alice: {$push: 1},
     *         tom: {jack: {$set: {x: 1}}
     *     }
     * );
     * ```
     *
     * 该函数返回一个数组，其中第二个元素为对象更新前后的差异，一个差异对象大致有以下结构：
     *
     * ```javascript
     * {
     *     foo: {
     *         bar: {
     *             changeType: 'add' // can be "add", "change" or "remove",
     *             oldValue: [1, 2, 3],
     *             newValue: [2, 3, 4]
     *         }
     *     }
     * }
     * ```
     *
     * 我们可以对差异对象进行简单的遍历，其中通过`isDiffNode`函数判断的节点即为差异节点，因此我们可以找到对象更新前后的最小差异
     *
     * **需注意的是当前版本并未实现数组类型的差异描述**
     *
     * @param {Object} source 待更新的对象
     * @param {Object} commands 用于更新的指令
     * @return {Array} 函数返回一个数组，结构为`[newObject, diff]`，其中
     *     `newObject`为更新后的对象，`diff`为更新前后的差异,
     *     `diff` is a diff object between the original object and the modified one.
     */
    function withDiff(source, commands) {
        // 如果根节点就是个指令，那么直接对输入的对象进行操作，不需要再遍历属性了
        var possibleRootCommand = Object.keys(AVAILABLE_COMMANDS).filter(commands.hasOwnProperty.bind(commands))[0];
        if (possibleRootCommand) {
            var wrapper = { source: source };
            var commandValue = commands[possibleRootCommand];

            var _AVAILABLE_COMMANDS$p = AVAILABLE_COMMANDS[possibleRootCommand](wrapper, 'source', commandValue);

            var _AVAILABLE_COMMANDS$p2 = _slicedToArray(_AVAILABLE_COMMANDS$p, 2);

            var newValue = _AVAILABLE_COMMANDS$p2[0];
            var _diff = _AVAILABLE_COMMANDS$p2[1];

            return [newValue, _diff];
        }

        var diff = {};
        var result = Object.keys(commands).reduce(function (result, key) {
            var propertyCommand = commands[key];
            // 找到指令节点后，对当前属性进行更新
            var tryExecuteCommand = function tryExecuteCommand(_ref3) {
                var _ref4 = _slicedToArray(_ref3, 2);

                var command = _ref4[0];
                var execute = _ref4[1];

                if (propertyCommand.hasOwnProperty(command)) {
                    var _execute = execute(result, key, propertyCommand[command]);

                    var _execute2 = _slicedToArray(_execute, 2);

                    var _newValue2 = _execute2[0];
                    var propertyDiff = _execute2[1];

                    result[key] = _newValue2;
                    if (propertyDiff) {
                        diff[key] = propertyDiff;
                    }
                    return true;
                }
                return false;
            };
            var isCommand = Object.entries(AVAILABLE_COMMANDS).some(tryExecuteCommand);
            // 如果这个节点不代表指令，那么肯定它的某个属性（或子属性）是指令，继续递归往下找
            if (!isCommand) {
                var _withDiff = withDiff(result[key] || {}, propertyCommand);

                var _withDiff2 = _slicedToArray(_withDiff, 2);

                var _newValue3 = _withDiff2[0];
                var propertyDiff = _withDiff2[1];

                result[key] = _newValue3;
                if (propertyDiff) {
                    diff[key] = propertyDiff;
                }
            }

            return result;
        }, clone(source));

        if (isEmpty(diff)) {
            diff = null;
        }
        return [result, diff];
    }

    function buildPathObject(path, value) {
        if (!path) {
            return value;
        }

        if (typeof path === 'string') {
            path = [path];
        }

        var result = {};
        var current = result;
        for (var i = 0; i < path.length - 1; i++) {
            current = current[path[i]] = {};
        }
        current[path[path.length - 1]] = value;
        return result;
    }

    /**
     * 效果等同于`withDiff`函数，但不返回差异对象
     *
     * @param {Object} source 待更新的对象
     * @param {Object} commands 用于更新的指令
     * @return {Object} 更新后的新对象
     */
    function update(source, commands) {
        return withDiff(source, commands)[0];
    }

    /**
     * 针对`$set`指令的快捷函数
     *
     * @param {Object} source 待更新的对象
     * @param {string?|Array.<string>} path 属性的路径，如果更新二层以上的属性则需要提供一个字符串数组，
     *     如果该参数为`undefined`或`null`，则会直接对`source`对象进行更新操作
     * @param {*} value 用于更新的值
     * @return {Object} 更新后的新对象
     */
    function set(source, path, value) {
        return update(source, buildPathObject(path, { $set: value }));
    }

    /**
     * 针对`$push`指令的快捷函数
     *
     * @param {Object} source 待更新的对象
     * @param {string?|Array.<string>} path 属性的路径，如果更新二层以上的属性则需要提供一个字符串数组，
     *     如果该参数为`undefined`或`null`，则会直接对`source`对象进行更新操作
     * @param {*} value 用于更新的值
     * @return {Object} 更新后的新对象
     */
    function push(source, path, value) {
        return update(source, buildPathObject(path, { $push: value }));
    }

    /**
     * 针对`$unshift`指令的快捷函数
     *
     * @param {Object} source 待更新的对象
     * @param {string?|Array.<string>} path 属性的路径，如果更新二层以上的属性则需要提供一个字符串数组，
     *     如果该参数为`undefined`或`null`，则会直接对`source`对象进行更新操作
     * @param {*} value 用于更新的值
     * @return {Object} 更新后的新对象
     */
    function unshift(source, path, value) {
        return update(source, buildPathObject(path, { $unshift: value }));
    }

    /**
     * 针对`$merge`指令的快捷函数
     *
     * @param {Object} source 待更新的对象
     * @param {string?|Array.<string>} path 属性的路径，如果更新二层以上的属性则需要提供一个字符串数组，
     *     如果该参数为`undefined`或`null`，则会直接对`source`对象进行更新操作
     * @param {*} value 用于更新的值
     * @return {Object} 更新后的新对象
     */
    function merge(source, path, value) {
        return update(source, buildPathObject(path, { $merge: value }));
    }

    /**
     * 针对`$defaults`指令的快捷函数
     *
     * @param {Object} source 待更新的对象
     * @param {string?|Array.<string>} path 属性的路径，如果更新二层以上的属性则需要提供一个字符串数组，
     *     如果该参数为`undefined`或`null`，则会直接对`source`对象进行更新操作
     * @param {*} value 用于更新的值
     * @return {Object} 更新后的新对象
     */
    function defaults(source, path, value) {
        return update(source, buildPathObject(path, { $defaults: value }));
    }

    /**
     * 针对`$invoke`指令的快捷函数
     *
     * @param {Object} source 待更新的对象
     * @param {string?|Array.<string>} path 属性的路径，如果更新二层以上的属性则需要提供一个字符串数组，
     *     如果该参数为`undefined`或`null`，则会直接对`source`对象进行更新操作
     * @param {Function} factory 用于生成新值的工厂函数
     * @return {Object} 更新后的新对象
     */
    function invoke(source, path, factory) {
        return update(source, buildPathObject(path, { $invoke: factory }));
    }
});
define(['exports', '../common/binding', './ViewModel'], function (exports, _binding, _ViewModel) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.start = undefined;

    var binding = _interopRequireWildcard(_binding);

    var _ViewModel2 = _interopRequireDefault(_ViewModel);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }

            newObj.default = obj;
            return newObj;
        }
    }

    function _asyncToGenerator(fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            return step("next", value);
                        }, function (err) {
                            return step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    }

    var BINDING_ATTR_PREFIX = 'binding-';
    var EVENT_ATTR_PREFIX = 'on-';

    var initializeElement = function initializeElement(element, model) {
        var bindings = Array.from(element.attributes).filter(function (_ref) {
            var name = _ref.name;
            return name.startsWith(BINDING_ATTR_PREFIX);
        }).map(function (attr) {
            return { name: attr.name.substring(BINDING_ATTR_PREFIX.length), value: attr.value };
        });

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = bindings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var config = _step.value;

                var bind = binding[config.name](element, config.value);
                bind(model);
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

        var events = Array.from(element.attributes).filter(function (_ref2) {
            var name = _ref2.name;
            return name.startsWith(EVENT_ATTR_PREFIX);
        }).map(function (attr) {
            return { name: attr.name.substring(EVENT_ATTR_PREFIX.length), value: attr.value };
        });

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            var _loop = function _loop() {
                var config = _step2.value;

                element.addEventListener(config.name, function () {
                    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(e) {
                        var params, command;
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                            while (1) {
                                switch (_context.prev = _context.next) {
                                    case 0:
                                        params = Object.assign({}, document.body.firstChild.dataset);
                                        _context.next = 3;
                                        return model[config.value](params);

                                    case 3:
                                        command = _context.sent;

                                        model.update(command);

                                    case 5:
                                    case 'end':
                                        return _context.stop();
                                }
                            }
                        }, _callee, undefined);
                    }));

                    return function (_x) {
                        return ref.apply(this, arguments);
                    };
                }(), false);
            };

            for (var _iterator2 = events[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                _loop();
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        element.children.forEach(function (child) {
            return initializeElement(child, model);
        });
    };

    var start = exports.start = function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var model;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            model = new _ViewModel2.default();

                            initializeElement(document.body, model);

                            try {
                                model.init();
                            } catch (ex) {
                                location.href = 'login.html?error=403';
                            }

                        case 3:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined);
        }));

        return function start() {
            return ref.apply(this, arguments);
        };
    }();
});
define(['exports', './fetch'], function (exports, _fetch) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.start = undefined;

    var _fetch2 = _interopRequireDefault(_fetch);

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

    var start = exports.start = function start() {
        document.querySelector('form').addEventListener('submit', function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(e) {
                var inputs, data;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                e.preventDefault();

                                inputs = Array.from(e.target.querySelectorAll('input'));
                                data = inputs.reduce(function (result, _ref) {
                                    var name = _ref.name;
                                    var value = _ref.value;
                                    return Object.assign(result, _defineProperty({}, name, value));
                                }, {});
                                _context.next = 5;
                                return (0, _fetch2.default)('/logins', { method: 'PUT', body: data });

                            case 5:
                                location.href = 'index.html';

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, undefined);
            }));

            return function (_x) {
                return ref.apply(this, arguments);
            };
        }());
    };
});
define(['exports', '../common/fetch', 'emc'], function (exports, _fetch, _emc) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _fetch2 = _interopRequireDefault(_fetch);

    var _emc2 = _interopRequireDefault(_emc);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
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

    var ViewModel = function (_Model) {
        _inherits(ViewModel, _Model);

        function ViewModel() {
            _classCallCheck(this, ViewModel);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ViewModel).call(this));

            _this.set('currentBucket', null);
            _this.set('buckets', []);
            _this.set('objects', []);

            _this.defineComputedProperty('listType', ['currentBucket'], function () {
                return _this.get('currentBucket') ? 'objects' : 'buckets';
            });
            return _this;
        }

        _createClass(ViewModel, [{
            key: 'init',
            value: function () {
                var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.next = 2;
                                    return this.fetchBuckets();

                                case 2:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));

                function init() {
                    return ref.apply(this, arguments);
                }

                return init;
            }()
        }, {
            key: 'fetchBuckets',
            value: function () {
                var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                    var buckets;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    _context2.next = 2;
                                    return (0, _fetch2.default)('/buckets');

                                case 2:
                                    buckets = _context2.sent;

                                    this.set('buckets', buckets);

                                case 4:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this);
                }));

                function fetchBuckets() {
                    return ref.apply(this, arguments);
                }

                return fetchBuckets;
            }()
        }]);

        return ViewModel;
    }(_emc2.default);

    exports.default = ViewModel;
});
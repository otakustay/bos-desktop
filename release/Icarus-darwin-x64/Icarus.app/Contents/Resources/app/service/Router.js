'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RouteError = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _routePattern = require('route-pattern');

var _routePattern2 = _interopRequireDefault(_routePattern);

var _diffyUpdate = require('diffy-update');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RouteError = exports.RouteError = function (_Error) {
    _inherits(RouteError, _Error);

    function RouteError(url, type) {
        _classCallCheck(this, RouteError);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RouteError).call(this, 'Reouting error ' + type + ' on ' + url));

        _this.type = type;
        _this.url = url;
        return _this;
    }

    return RouteError;
}(Error);

var Router = function () {
    function Router() {
        _classCallCheck(this, Router);

        this.routes = [];
    }

    _createClass(Router, [{
        key: 'register',
        value: function register(_ref) {
            var _ref2 = _slicedToArray(_ref, 3);

            var method = _ref2[0];
            var url = _ref2[1];
            var handler = _ref2[2];

            var pattern = _routePattern2.default.fromString(url);
            this.routes.push(Object.assign({ pattern: pattern }, { method: method, url: url, handler: handler }));
        }
    }, {
        key: 'registerAll',
        value: function registerAll(routes) {
            routes.forEach(this.register, this);
        }
    }, {
        key: 'execute',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(incomingRequest) {
                var route, matchedData, routeParams, requestContext, result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                route = this.routes.find(function (route) {
                                    return route.pattern.matches(incomingRequest.url);
                                });

                                if (route) {
                                    _context.next = 3;
                                    break;
                                }

                                throw new RouteError(incomingRequest.url, 'NotFound');

                            case 3:
                                matchedData = route.pattern.match(incomingRequest.url);
                                routeParams = Object.assign({}, matchedData.namedParams, matchedData.queryParams);
                                requestContext = (0, _diffyUpdate.merge)(incomingRequest, 'params', routeParams);
                                _context.next = 8;
                                return route.handler.call(null, requestContext);

                            case 8:
                                result = _context.sent;
                                return _context.abrupt('return', result);

                            case 10:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function execute(_x) {
                return ref.apply(this, arguments);
            }

            return execute;
        }()
    }]);

    return Router;
}();

exports.default = Router;
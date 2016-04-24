'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = undefined;

var _electron = require('electron');

var _Router = require('./Router');

var _Router2 = _interopRequireDefault(_Router);

var _index = require('./route/index');

var _index2 = _interopRequireDefault(_index);

var _store = require('./store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var start = exports.start = function start() {
    var router = new _Router2.default();
    router.registerAll(_index2.default);

    _electron.ipcMain.on('message', function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(event, _ref) {
            var token = _ref.token;
            var url = _ref.url;
            var body = _ref.body;
            var request, result;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            request = {
                                url: url,
                                body: body,
                                params: (0, _store.dump)()
                            };
                            _context.prev = 1;
                            _context.next = 4;
                            return router.execute(request);

                        case 4:
                            result = _context.sent;

                            event.sender.send('message', { token: token, success: true, response: result });
                            _context.next = 11;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context['catch'](1);

                            event.sender.send('message', { token: token, success: false, response: _context.t0 });

                        case 11:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[1, 8]]);
        }));

        return function (_x, _x2) {
            return ref.apply(this, arguments);
        };
    }());
};
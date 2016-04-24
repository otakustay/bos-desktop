'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _store = require('../store');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request) {
        var bosConfig;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        bosConfig = {
                            credentials: {
                                ak: request.body.ak,
                                sk: request.body.sk
                            },
                            // TODO: 可配置
                            endpoint: 'https://bj.bcebos.com'
                        };


                        (0, _store.set)('bosConfig', bosConfig);

                        return _context.abrupt('return', null);

                    case 3:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x) {
        return ref.apply(this, arguments);
    };
}();
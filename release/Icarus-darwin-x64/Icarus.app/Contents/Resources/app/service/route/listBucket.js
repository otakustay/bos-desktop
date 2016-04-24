'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bceSdkJs = require('bce-sdk-js');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request) {
        var client, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        client = new _bceSdkJs.BosClient(request.params.bosConfig);
                        _context.next = 3;
                        return client.listBuckets();

                    case 3:
                        response = _context.sent;
                        return _context.abrupt('return', response.body.buckets);

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
}();
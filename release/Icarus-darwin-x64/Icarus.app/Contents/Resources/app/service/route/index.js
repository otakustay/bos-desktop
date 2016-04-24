'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _login = require('./login');

var _login2 = _interopRequireDefault(_login);

var _listBucket = require('./listBucket');

var _listBucket2 = _interopRequireDefault(_listBucket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [['PUT', '/logins', _login2.default], ['GET', '/buckets', _listBucket2.default]];
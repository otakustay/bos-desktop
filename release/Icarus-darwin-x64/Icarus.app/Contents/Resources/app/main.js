'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

require('babel-polyfill');

var _electron = require('electron');

var _electron2 = _interopRequireDefault(_electron);

var _main = require('./service/main');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const USER_DATA_DIRECTORY = require('electron').app.getPath('userData');
// require('log4js').configure(
//     require('path').join(__dirname, '.logrc'),
//     {cwd: USER_DATA_DIRECTORY}
// );

/**
 * @file 入口
 * @author otakustay
 */

var app = _electron2.default.app;

app.on('window-all-closed', function () {
  return app.quit();
});
app.on('ready', _main.start);
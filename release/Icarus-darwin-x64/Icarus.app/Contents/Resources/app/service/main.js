/**
 * @file 入口
 * @author otakustay
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = undefined;

var _electron = require('electron');

var _electron2 = _interopRequireDefault(_electron);

var _path = require('path');

var _server = require('./server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const DEBUG = process.argv.includes('--debug');
var WINDOW_OPTIONS = {
    width: 800,
    height: 600
};
// const STORAGE_DIRECTORY = DEBUG ? require('path').join(__dirname, '..', 'storage') : electron.app.getPath('userData');
// const VERSION = electron.app.getVersion();

/**
 * 启动应用后端
 */

// let logger = require('log4js').getLogger('main');
var start = exports.start = function start() {
    // logger.info(`Start app version ${VERSION}`);
    // logger.trace(`All data will be saved at ${STORAGE_DIRECTORY}`);

    (0, _server.start)();

    var BrowserWindow = _electron2.default.BrowserWindow;
    var mainWindow = new BrowserWindow(WINDOW_OPTIONS);
    var url = 'file://' + (0, _path.join)(__dirname, '..', 'static', 'login.html');
    mainWindow.loadURL(url);

    // logger.trace(`Main window opened with size ${INITIAL_WINDOW_SIZE.width} x ${INITIAL_WINDOW_SIZE.height}`);
};
/**
 * @file 入口
 * @author otakustay
 */

'use strict';

import electron from 'electron';
import {join as joinPath} from 'path';
// let logger = require('log4js').getLogger('main');
import {start as startServer} from './server';

// const DEBUG = process.argv.includes('--debug');
const WINDOW_OPTIONS = {
    width: 800,
    height: 600
};
// const STORAGE_DIRECTORY = DEBUG ? require('path').join(__dirname, '..', 'storage') : electron.app.getPath('userData');
// const VERSION = electron.app.getVersion();

/**
 * 启动应用后端
 */
export let start = () => {
    // logger.info(`Start app version ${VERSION}`);
    // logger.trace(`All data will be saved at ${STORAGE_DIRECTORY}`);

    startServer();

    let BrowserWindow = electron.BrowserWindow;
    let mainWindow = new BrowserWindow(WINDOW_OPTIONS);
    let url = 'file://' + joinPath(__dirname, '..', 'static', 'login.html');
    mainWindow.loadURL(url);

    // logger.trace(`Main window opened with size ${INITIAL_WINDOW_SIZE.width} x ${INITIAL_WINDOW_SIZE.height}`);
};


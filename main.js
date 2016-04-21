/**
 * @file 入口
 * @author otakustay
 */

import path from 'path';
import 'babel-polyfill';
import electron from 'electron';
import {start} from './service/main';

// const USER_DATA_DIRECTORY = require('electron').app.getPath('userData');
// require('log4js').configure(
//     require('path').join(__dirname, '.logrc'),
//     {cwd: USER_DATA_DIRECTORY}
// );

let app = electron.app;

app.on('window-all-closed', () => app.quit());
app.on('ready', start);

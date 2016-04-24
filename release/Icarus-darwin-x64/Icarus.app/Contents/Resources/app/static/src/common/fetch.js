define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _nodeRequire = nodeRequire('crypto');

    var /* globals nodeRequire */

    createHash = _nodeRequire.createHash;

    var _nodeRequire2 = nodeRequire('electron');

    var ipc = _nodeRequire2.ipcRenderer;


    var REMOTE_CHANNEL = 'message';

    var uid = 0x861005;

    // 其实这里只需要一个唯一值，搞成这样是我无聊，别拦着我
    var newToken = function newToken() {
        var id = (uid++).toString();
        return createHash('md5').update(id).digest('hex');
    };

    /**
     * 只支持`(url, init)`形式的`Fetch API`实现，其中`options`只支持`method`和`body`
     *
     * @param {string} url 请求的URL
     * @param {Object} [init] 相关配置
     * @param {string} [init.method] 使用的HTTP Method
     * @param {Object} [init.body] 发送的数据
     * @return {Promise}
     */

    exports.default = function (url) {
        var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var _ref$method = _ref.method;
        var method = _ref$method === undefined ? 'GET' : _ref$method;
        var body = _ref.body;

        var executor = function executor(resolve, reject) {
            var token = newToken();

            var matchResponse = function matchResponse(event, payload) {
                if (payload.token !== token) {
                    return;
                }

                ipc.removeListener(REMOTE_CHANNEL, matchResponse);

                if (payload.success) {
                    resolve(payload.response);
                } else {
                    reject(payload.response);
                }
            };

            ipc.on(REMOTE_CHANNEL, matchResponse);
            ipc.send(REMOTE_CHANNEL, { token: token, url: url, body: body });
        };
        return new Promise(executor);
    };
});
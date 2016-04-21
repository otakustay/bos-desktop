let {createHash} = nodeRequire('crypto');
let {ipcRenderer: ipc} = nodeRequire('electron');

const REMOTE_CHANNEL = 'message';

let uid = 0x861005;

// 其实这里只需要一个唯一值，搞成这样是我无聊，别拦着我
let newToken = () => {
    let id = (uid++).toString();
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
export default (url, {method = 'GET', body} = {}) => {
    let executor = (resolve, reject) => {
        let token = newToken();

        let matchResponse = (event, payload) => {
            if (payload.token !== token) {
                return;
            }

            ipc.removeListener(REMOTE_CHANNEL, matchResponse);

            if (payload.success) {
                resolve(payload.response);
            }
            else {
                reject(payload.response);
            }
        };

        ipc.on(REMOTE_CHANNEL, matchResponse);
        ipc.send(REMOTE_CHANNEL, {token, url, body});
    };
    return new Promise(executor);
};

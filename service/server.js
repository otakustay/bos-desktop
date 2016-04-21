import {ipcMain as ipc} from 'electron';
import Router from './Router';
import routes from './route/index';
import {dump as getGlobalData} from './store';

export let start = () => {
    let router = new Router();
    router.registerAll(routes);

    ipc.on(
        'message',
        async (event, {token, url, body}) => {
            let request = {
                url: url,
                body: body,
                params: getGlobalData()
            };

            try {
                let result = await router.execute(request);
                event.sender.send('message', {token: token, success: true, response: result});
            }
            catch (error) {
                event.sender.send('message', {token: token, success: false, response: error});
            }
        }
    );
}

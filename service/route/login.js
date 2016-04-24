import {set as setGlobal} from '../store';

export default async request => {
    let bosConfig = {
        credentials: {
            ak: request.body.ak,
            sk: request.body.sk
        },
        // TODO: 可配置
        endpoint: 'https://bj.bcebos.com'
    };

    setGlobal('bosConfig', bosConfig);

    return null;
};

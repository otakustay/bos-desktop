import {BosClient} from 'bce-sdk-js';

export default async request => {
    let config = {
        credentials: {
            ak: 'b92ea4a39f3645c8ae5f64ba5fc2a357',
            sk: 'a4ce012968714958a21bb90dc180de17'
        },
        endpoint: 'https://bj.bcebos.com'
    };

    let client = new BosClient(config);
    let response = await client.listBuckets();

    return response;
};

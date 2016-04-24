import {BosClient} from 'bce-sdk-js';
import {set} from 'diffy-update';

export default async request => {
    let endpoint = `https://${request.params.location}.bcebos.com`;
    let bosConfig = set(request.params.bosConfig, 'endpoint', endpoint);
    let client = new BosClient(bosConfig);
    let response = await client.listObjects(request.params.bucket);

    return response.body.contents;
};

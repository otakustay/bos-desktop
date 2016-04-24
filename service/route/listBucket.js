import {BosClient} from 'bce-sdk-js';

export default async request => {
    let client = new BosClient(request.params.bosConfig);
    let response = await client.listBuckets();

    return response.body.buckets;
};

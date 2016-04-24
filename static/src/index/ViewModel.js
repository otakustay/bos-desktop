import fetch from '../common/fetch';
import update from 'diffy-update';
import Model from 'emc';

const LOCATION_NAME = {
    bj: '北京',
    gz: '广州',
    xg: '香港'
};

export default class ViewModel extends Model {
    constructor() {
        super();

        this.defineComputedProperty(
            'listType',
            ['currentBucket'],
            () => this.get('currentBucket') ? 'objects' : 'buckets'
        );

        this.defineComputedProperty(
            'isInBucketList',
            ['listType'],
            () => this.get('listType') === 'buckets'
        );

        this.defineComputedProperty(
            'isInObjectList',
            ['listType'],
            () => this.get('listType') === 'objects'
        );

        this.set('currentBucket', null);
        this.set('buckets', []);
        this.set('objects', []);
    }

    async init() {
        let buckets = await this.fetchBuckets();
        this.set('buckets', buckets);
    }

    async fetchBuckets() {
        let buckets = await fetch('/buckets');

        let convertToDisplay = bucket => {
            let creationDate = new Date(bucket.creationDate);
            let command = {
                creationTime: {$set: creationDate.toLocaleString()},
                locationName: {$set: LOCATION_NAME[bucket.location]}
            };
            return update(bucket, command);
        };

        return buckets.map(convertToDisplay);
    }

    async fetchObjects(bucket) {
        let objects = await fetch(`/buckets/${bucket}/objects`);

        return objects;
    }
}

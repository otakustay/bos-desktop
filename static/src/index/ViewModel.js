import fetch from '../common/fetch';
import update from 'diffy-update';
import Model from 'emc';

const LOCATION_NAME = {
    bj: '北京',
    gz: '广州',
    xg: '香港'
};

let readableSize = sizeInByte => {
    if (sizeInByte < 1024) {
        return sizeInByte + 'B';
    }

    let units = ['KB', 'MB', 'GB'];
    let size = sizeInByte;

    for (let unit of units) {
        size /= 1024;
        if (size < 1024) {
            return size.toFixed(2) + unit;
        }
    }

    return size.toFixed(2) + 'GB';
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

    async changeBucket({bucket: bucketName}) {
        let bucket = this.get('buckets').find(bucket => bucket.name === bucketName);
        let objects = await this.fetchObjects(bucket);

        return {
            currentBucket: {$set: bucketName},
            objects: {$set: objects}
        };
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
        let objects = await fetch(`/buckets/${bucket.location}/${bucket.name}/objects`);

        let convertToDisplay = object => {
            let lastModifiedTime = new Date(object.lastModified);
            let command = {
                readableSize: {$set: readableSize(object.size)},
                lastModifiedTime: {$set: lastModifiedTime.toLocaleString()}
            };
            return update(object, command);
        };

        return objects.map(convertToDisplay);
    }
}

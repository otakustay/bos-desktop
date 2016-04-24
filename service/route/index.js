import login from './login';
import listBucket from './listBucket';
import listObjects from './listObjects';

export default [
    ['PUT', '/logins', login],
    ['GET', '/buckets', listBucket],
    ['GET', '/buckets/:location/:bucket/objects', listObjects]
];

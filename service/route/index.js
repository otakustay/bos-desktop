import login from './login';
import listBucket from './listBucket';

export default [
    ['PUT', '/logins', login],
    ['GET', '/buckets', listBucket]
];

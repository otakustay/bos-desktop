import fetch from './fetch';

export let start = async () => {
    let response = await fetch('/buckets');
    console.log(response);
};

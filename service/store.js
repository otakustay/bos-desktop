let data = {};

export let dump = () => Object.assign({}, data);

export let set = (key, value) => data[key] = value;

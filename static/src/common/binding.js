import etpl from 'etpl';
import {isDiffNode} from 'diffy-update/diffNode';

const BINDING_ATTR_PREFIX = 'binding-';
const EVENT_ATTR_PREFIX = 'on-';

let createWatcher = (property, callback) => model => {
    model.on(
        'update',
        ({diff}) => {
            let node = diff[property];
            if (node && isDiffNode(node)) {
                callback(node.newValue, model);
            }
        }
    );
};

let binding = {};

export let initialize = (element, model) => {
    let bindings = Array.from(element.attributes)
        .filter(({name}) => name.startsWith(BINDING_ATTR_PREFIX))
        .map(attr => ({name: attr.name.substring(BINDING_ATTR_PREFIX.length), value: attr.value}));

    for (let config of bindings) {
        let bind = binding[config.name](element, config.value);
        bind(model);
    }

    let events = Array.from(element.attributes)
        .filter(({name}) => name.startsWith(EVENT_ATTR_PREFIX))
        .map(attr => ({name: attr.name.substring(EVENT_ATTR_PREFIX.length), value: attr.value}));

    for (let config of events) {
        /* eslint-disable no-loop-func */
        element.addEventListener(
            config.name,
            async e => {
                let params = Object.assign({}, e.currentTarget.dataset);
                let command = await model[config.value](params);
                if (command) {
                    model.update(command);
                }
            },
            false
        );
        /* eslint-enable no-loop-func */
    }

    Array.from(element.children).forEach(child => initialize(child, model));
};

export let content = binding.content = (element, property) => {
    let template = element.querySelector('script').textContent;
    let render = etpl.parse(template);
    return createWatcher(
        property,
        (value, model) => {
            if (!value) {
                element.innerHTML = '';
            }
            else {
                element.innerHTML = render({data: value});
                Array.from(element.children).forEach(child => initialize(child, model));
            }
        }
    );
};

export let display = binding.display = (element, property) => createWatcher(
    property,
    value => element.style.display = value ? '' : 'none'
);

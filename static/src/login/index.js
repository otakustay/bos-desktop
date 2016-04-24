import fetch from '../common/fetch';

export let start = () => {
    document.querySelector('form').addEventListener(
        'submit',
        async e => {
            e.preventDefault();

            let inputs = Array.from(e.target.querySelectorAll('input'));
            let data = inputs.reduce((result, {name, value}) => Object.assign(result, {[name]: value}), {});
            await fetch('/logins', {method: 'PUT', body: data});
            location.href = 'index.html';
        }
    );
};

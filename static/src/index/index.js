import * as binding from '../common/binding';
import ViewModel from './ViewModel';

export let start = async () => {
    let model = new ViewModel();
    binding.initialize(document.body, model);

    try {
        model.init();
    }
    catch (ex) {
        location.href = 'login.html?error=403';
    }
};

define(['exports', 'etpl', 'diffy-update/diffNode'], function (exports, _etpl, _diffNode) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.display = exports.content = undefined;

    var _etpl2 = _interopRequireDefault(_etpl);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var createWatcher = function createWatcher(property, callback) {
        return function (model) {
            model.on('update', function (diff) {
                if ((0, _diffNode.isDiffNode)(diff[property])) {
                    callback(diff[property].newValue);
                }
            });
        };
    };

    var content = exports.content = function content(element, property) {
        var template = element.querySelector('script').textContent;
        var render = _etpl2.default.parse(template);
        return createWatcher(property, function (value) {
            return element.innerHTML = render(value);
        });
    };

    var display = exports.display = function display(element, property) {
        return createWatcher(property, function (value) {
            return element.style.display = value ? '' : 'none';
        });
    };
});
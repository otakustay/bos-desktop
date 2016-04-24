define(['exports', 'babel-core'], function (exports, babelCore) {
    'use strict';

    exports.port = 8848;
    exports.directoryIndexes = true;
    exports.documentRoot = __dirname;

    var BABEL_OPTIONS = {
        presets: ['es2015', 'stage-0'],
        "plugins": ["transform-es2015-modules-amd"],
        ast: false
    };


    exports.getLocations = function () {
        return [{
            // All source and spec files
            key: 'source',
            location: /(src|spec)\/.+\.js/,
            handler: [function (context) {
                console.log('match', context.request.url);
            }, babel(BABEL_OPTIONS, { babel: babelCore })]
        }, {
            location: /^.*$/,
            handler: [file()]
        }];
    };

    exports.injectResource = function (res) {
        for (var key in res) {
            global[key] = res[key];
        }
    };
});
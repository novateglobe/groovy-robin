const path = require('path');
const sourcebit = require('sourcebit');
const _ = require('lodash');

const sourcebitConfig = require('./sourcebit.js');
const createDeferredPromise = require('./src/utils/createDeferredPromise');
const createGetPaletteKeyFunction = require('./src/utils/getPaletteKey');


const deferredPromise = createDeferredPromise();

sourcebit.fetch(sourcebitConfig, (error, data) => {
    const configObject = _.find(data.objects, _.matchesProperty('__metadata.modelName', 'config'));
    // resolve deferredPromise.promise
    deferredPromise.resolve(configObject);
    // create new resolved promise that will be resolved immediately
    deferredPromise.promise = Promise.resolve(configObject);
});

module.exports = {
    exportTrailingSlash: true,
    devIndicators: {
        autoPrerender: false
    },
    sassOptions: {
        // scss files might import plain css files from the "public" folder:
        // @import "example.css";
        // the importer function rewrites path to these files relative to the scss file:
        // @import "../../public/assets/css/example.css";
        importer: (url, prev, done) => {
            if (/\.css$/i.test(url)) {
                return { file: path.join('../../public/assets/css', url) }
            }
            return null;
        },
        functions: {
            "getPaletteKey($key)": createGetPaletteKeyFunction(deferredPromise)
        }
    },
    webpack: (config, { webpack }) => {
        // Tell webpack to ignore watching content files in the content folder.
        // Otherwise webpack receompiles the app and refreshes the whole page.
        // Instead, the src/pages/[...slug].js uses the "withRemoteDataUpdates"
        // function to update the content on the page without refreshing the
        // whole page
        config.plugins.push(new webpack.WatchIgnorePlugin([/\/content\//]));
        return config;
    }
};

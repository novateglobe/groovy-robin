const path = require('path');
const sourcebit = require('sourcebit');
const sourcebitConfig = require('./sourcebit.js');
const _ = require('lodash');
const sass = require('node-sass');
const sassUtils = require('node-sass-utils')(sass);


let configObject;
sourcebit.fetch(sourcebitConfig, (error, data) => {
    configObject = _.find(data.objects, _.matchesProperty('__metadata.modelName', 'config'));
});

module.exports = {
    exportTrailingSlash: true,
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
            "getPaletteKey($key)": function(sassKey) {
                function hexToRgb(hex) {
                    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
                    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                        return r + r + g + g + b + b;
                    });

                    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    return result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : null;
                }
                let sassParams = configObject.palettes[configObject.palette].sass;
                let key = sassKey.getValue();
                let value = sassParams[key];
                let colorRegExp = /^#(?:[a-f\d]{3}){1,2}$/i;
                let result;
                if (colorRegExp.test(value)) {
                    result = hexToRgb(value);
                    result = new sass.types.Color(result.r, result.g, result.b);
                } else {
                    result = sassUtils.castToSass(value)
                }
                return result;
            }
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

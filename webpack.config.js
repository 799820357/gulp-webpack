//entry
const entry = require('./webpack-config/entry');
//output
const output = require('./webpack-config/output');
//loaders
const rules = require('./webpack-config/rules');
//resolve
const resolve = require('./webpack-config/resolve');
//optimization
const optimization = require('./webpack-config/optimization');

module.exports = projectInfo => {
    return {
        mode: projectInfo.mode,
        entry: entry(projectInfo),
        output: output(projectInfo),
        module: {
            rules: rules(projectInfo)
        },
        resolve: resolve(projectInfo),
        optimization: optimization(projectInfo),
        devtool: projectInfo.mode == 'production' ? false : 'cheap-module-eval-source-map'
    };
};

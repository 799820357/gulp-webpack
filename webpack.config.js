/*
 * @Author: your name
 * @Date: 2020-11-13 19:54:18
 * @LastEditTime: 2021-04-15 09:54:05
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \gulp-webpack\webpack.config.js
 */
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
        target: ['web', 'es5'],
        mode: projectInfo.mode,
        entry: entry(projectInfo),
        output: output(projectInfo),
        module: {
            rules: rules(projectInfo)
        },
        resolve: resolve(projectInfo),
        optimization: optimization(projectInfo),
        devtool: projectInfo.mode == 'production' ? false : 'eval-cheap-module-source-map'
    };
};

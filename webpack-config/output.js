const path = require('path');
module.exports = projectInfo => {
    //返回
    return {
        filename : `${projectInfo.mode == 'production' ? '[name]-min' : '[name]'}.js`,
        path: path.join(projectInfo.output, 'js'),
        publicPath: ''
    };
}
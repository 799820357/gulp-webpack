const path = require('path');
const fs = require("fs")
module.exports = projectInfo => {
    let jsPath = path.join(projectInfo.entry,'js')
    let files = fs.readdirSync(jsPath);
    let result = {};
    files.forEach(fileName => {
        if(/.js$/.test(fileName)){
            let name = fileName.replace(/.js/,'')
            result[name] = path.join(jsPath,fileName)
        }
        
    })
    return result
};
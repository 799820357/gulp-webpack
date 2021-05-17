const path = require('path')
const { src, dest, parallel, series, watch } = require('gulp')
//parallel:并行任务,series:串行任务
const gulpClean = require('gulp-clean')
const gulpFileInclude = require('gulp-file-include')
const gulpSass = require('gulp-sass');
const gulpAutoprefixer = require('gulp-autoprefixer')
const gulpRename = require('gulp-rename')
const gulpCleanCss = require('gulp-clean-css')
const gulpCache = require('gulp-cache')
const gulpImagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')
const webpack = require('webpack')
const gulpConnect = require('gulp-connect')
//项目信息
const projectInfo = (params => {
    let result = {
        dirname: path.join(__dirname),
        entry : path.join(__dirname,'src'),
        output : path.join(__dirname,'dist'),
        version : + new Date
    };
    params.split(',').forEach(item => {
        item = item.split(':');
        result[item[0]] = item[1];
    });
    return result;
})(process.env.NODE_ENV);
//webpack-config
const webpackConfig = require('./webpack.config')(projectInfo);
//清理
const clean = done => {
    return src(projectInfo.output,{ allowEmpty: true })
    .pipe(gulpClean())
}
//构建html
const html = done => {
    let result = src(
        path.join(projectInfo.entry, 'html', '*.html')
    )
    .pipe(
        gulpFileInclude({
            prefix : '@@',//变量前缀 @@include
            basepath : projectInfo.entry + '/html/',//引用文件路径
            indent : true,//保留文件的缩进
            context : {
                projectInfo
            }
        })
    )
    .pipe(
        dest(
            path.join(projectInfo.output, 'html')
        )
    )
    //判断是否需要刷新
    if(projectInfo.mode == 'development'){
        result.pipe(
            gulpConnect.reload()
        )
    }
    return result
}
//scss => css
const css = done => {
    return src(
        path.join(projectInfo.entry, 'scss', '*.scss')
    )
    .pipe(
        gulpSass.sync().on('error', gulpSass.logError)
    )
    .pipe(
        gulpAutoprefixer({
            // browsers: ['last 2 versions', 'Android >= 4.0'],
            overrideBrowserslist: [
                "Android 4.1",
                "iOS 7.1",
                "Chrome > 31",
                "ff > 31",
                "ie >= 7"
            ],
            cascade: true, //是否美化属性值 默认：true 像这样：-webkit-transform: rotate(45deg);transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true 
        })
    )
    .pipe(
        dest(
            path.join(projectInfo.output, 'css')
        )
    );
}
//css改名
const cssRename = done => {
    if(projectInfo.mode == 'development'){
        done()
    }else{
        return src(
            path.join(projectInfo.output, 'css', '*.css'),
            { allowEmpty: true }
        )
        .pipe(gulpClean())
        .pipe(
            gulpRename(p => {
                p.basename += '-min'
            })
        )
        .pipe(
            dest(
                path.join(projectInfo.output, 'css')
            )
        );
    }
}
//css压缩
const cssMin = done => {
    if(projectInfo.mode == 'development'){
        done()
    }else{
        return src(
            path.join(projectInfo.output, 'css', '*-min.css')
        )
        .pipe(
            gulpCleanCss({
                advanced: true,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
                compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
                keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
                keepSpecialComments: '*'//保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
            })
        )
        .pipe(
            dest(
                path.join(projectInfo.output, 'css')
            )
        );
    }
}
//复制image
const copyImage = done => {
    return src(
        path.join(projectInfo.entry, 'image', '**')
    )
    .pipe(
        dest(
            path.join(projectInfo.output, 'image')
        )
    )
}
//图片压缩
const imageMin = done => {
    if(projectInfo.mode == 'development'){
        done()
    }else{
        return src(
            path.join(projectInfo.output, 'image', '**')
        )
        .pipe(
            gulpCache(
                gulpImagemin(
                    {
                        optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
                        progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                        interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                        multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
                        use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
                    }
                )
            )
        )
        .pipe(
            dest(
                path.join(projectInfo.output, 'image')
            )
        );
    }
}
//js
const js = done => {
    //webpack
    webpack(webpackConfig).run(function(err,status){
        console.group('webpack-run');
        console.log(status.toString())
        console.groupEnd()
        done();
    });
}
//复制js库
const copyJsLib = done => {
    return src(
        path.join(projectInfo.entry, 'js', 'lib', '*.js')
    )
    .pipe(
        dest(
            path.join(projectInfo.output, 'js')
        )
    )
}
//connect
const connect = done => {
    if(projectInfo.mode == 'development'){
        gulpConnect.server({
            //host:'',
            root: 'dist',
            port: 8888,
            livereload: true,
            index : false,
            middleware:(connect,opt) => {
                let c = require('child_process');
                c.exec('start ' + 'http://' + opt.host + ':' + opt.port);
                return []
            }
        });
    }
    done();
}
//通用任务
const task = series(
    clean, 
    parallel(css, copyImage, js, copyJsLib), 
    parallel(imageMin, cssRename, cssMin),
    html
)

exports.default = series(task,connect,done => {
    //文件监听
    if(projectInfo.mode == 'development'){
        const watcher = watch(['src/**'])
        watcher.on('all', function(p, stats) {
            console.log(`File ${p} was changed`);
            task();
        });
    }
    done();
})
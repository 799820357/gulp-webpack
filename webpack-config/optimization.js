const TerserPlugin = require("terser-webpack-plugin");
module.exports = projectInfo => {
    return {
        splitChunks: {
            chunks: "all",
            minSize: 0, // 模块的最小体积
            minChunks: 1, // 模块的最小被引用次数
            maxAsyncRequests: 5, // 按需加载的最大并行请求数
            maxInitialRequests: 3, // 一个入口最大并行请求数
            automaticNameDelimiter: '-', // 文件名的连接符
            name: true,
            cacheGroups: { // 缓存组
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                  },
                  default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                  }
            }
        },
        // runtimeChunk: {
        //     name: entrypoint => `manifest.${entrypoint.name}`
        // },
        minimizer: [
            new TerserPlugin({
                parallel: 4, //开启并行压缩
                terserOptions: {
                    output: {
                        comments: false
                    },
                    ie8: true
                }
            })
        ]
    }
};
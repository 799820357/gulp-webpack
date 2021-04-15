const TerserPlugin = require("terser-webpack-plugin");
module.exports = projectInfo => {
    return {
        splitChunks: {
            chunks: "all",
            cacheGroups: { // 缓存组
                vendors: {
                    minSize:1,
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    name(module, chunks, cacheGroupKey) {
                        return cacheGroupKey;
                    }
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
        minimizer: [
            new TerserPlugin({
                parallel: true, //开启并行压缩
                terserOptions: {
                    format: {
                      comments: false,
                    },
                    extractComments: false
                },
            })
        ]
    }
};

var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: {
        main: './app/index.js',
        vendor: 'jquery'
    },
	output: {
		filename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'] // 指定公共 bundle 的名字。
        })
    ]
}

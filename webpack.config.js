var path = require('path');

var commonLoaders = [
	{ test: /(\.jsx|\.js)$/, exclude: /node_modules/, loader: '6to5-loader?optional=selfContained' }
];

var assetsPath = path.join(__dirname, 'public', 'js');
var publicPath = 'public/';

module.exports = [
	{
		// The configuration for the client
		name: 'browser',
		entry: './client/js/main.jsx',
		output: {
			path: assetsPath,
			filename: 'bundle.js',
			publicPath: publicPath
		},
		module: {
			loaders: commonLoaders
		},
    devtool: 'source-map'
	}
];

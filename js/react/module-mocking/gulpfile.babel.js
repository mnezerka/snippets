'use strict';

var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
import path from 'path';

var webpackConfig = {
    entry: {
        app: [path.resolve(__dirname, './src/app.js')],
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js'
    },
    devtool: '#eval-source-map',
    plugins: [],
    resolve: {
        extensions: ['', '.js'],
        root: [path.resolve(__dirname, './src')]
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel?stage=0']
            }
        ]
    },
};

function onBuild(done) {
    return function(err, stats) {
        if(err)
             throw new gutil.PluginError("webpack:build-dev", err);

        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));

        if (done)
            done();
    }
}

// The development server (the recommended option for development)
gulp.task('default', ['watch']);

gulp.task("build", function(done) {
    var buildWebpackConfig = Object.create(webpackConfig);
    buildWebpackConfig.plugins = [
        //new webpack.optimize.CommonsChunkPlugin("init.js"),
        //new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"libs", /* filename= */"libs.js"),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        //new webpack.optimize.OccurenceOrderPlugin(),
        //new webpack.NoErrorsPlugin()
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"'
            }
        }),
    ]

    var webpackCompiler = webpack(buildWebpackConfig);
    webpackCompiler.run(onBuild(done));
});

gulp.task("watch", function(done) {
    var webpackCompiler = webpack(webpackConfig);
    webpackCompiler.watch(100, onBuild());
});



const isDevEnv = process.env.NODE_ENV === 'development';
const doUploadCdn = process.env.NODE_UPLOAD_CDN;

const path = require('path');
const webpack = require('webpack');
const ConsolePlugin = require('vconsole-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin-for-multihtml');
const UploadCdnPlugin = require('./uploadCdnPlugin');
const utils = require('./util');

const entryConfigs = utils.getEntryConfigs();

const htmlPlugins = Object.keys(entryConfigs.htmls).map(function (template) {
    return new HtmlWebpackPlugin({
        filename: entryConfigs.htmls[template].filename,
        template,
        chunks: ['vendor', 'manifest'].concat(entryConfigs.htmls[template].chunks),
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: false,
            removeAttributeQuotes: true,
            // more options:
            // https://github.com/kangax/html-minifier#options-quick-reference
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency',
    });
});

const extractLESS = new ExtractTextPlugin({
    filename: utils.getHashedFileName('css'),
    allChunks: true,
});

module.exports = {
    entry: entryConfigs.entrys,
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: doUploadCdn ? utils.cdnPrefix : '../',
        filename: utils.getHashedFileName('js'),
        chunkFilename: utils.getHashedFileName('chunkjs'),
    },
    resolve: {
        extensions: ['.js', '.css', '.json', '.less', '.ts', '.tsx'],
        alias: {
            '@': path.resolve(__dirname, '../src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: extractLESS.extract({
                    fallback: 'style-loader',
                    use: [{
                            loader: 'css-loader',
                            query: {
                                importLoaders: 2,
                                minimize: !isDevEnv,
                                sourceMap: isDevEnv,
                            },
                        },
                        // postcssLoader,
                        {
                            loader: 'less-loader',
                        },
                    ],

                }),
            }, 
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [{
                    loader: "ts-loader",
                }],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [ 'source-map-loader', 'babel-loader' ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 2000,
                        name (file) {
                            const matches = /src\/(.+?)\/(.+?)\//.exec(file);
                            const imgFileName = utils.getHashedFileName('img');
                            if (matches && matches[1] && matches[2]) {
                                let imgPath = `${matches[2]}/`;
                                if (matches[1] === 'pages') {
                                    imgPath += 'img/';
                                }
                                return imgPath + imgFileName;
                            }
                            return imgFileName;
                        },
                        publicPath (file) {
                            if (doUploadCdn) {
                                return utils.cdnPrefix + file;
                            }
                            return `/${file}`;
                        },
                    },
                }, 
                {
                    loader: 'image-webpack-loader',
                    options: {
                        disable: !isDevEnv,
                        mozjpeg: {
                            progressive: true,
                            quality: 80,
                        },
                        optipng: {
                            enabled: false,
                        },
                        pngquant: {
                            quality: '75-90',
                            speed: 4,
                        },
                        gifsicle: {
                            interlaced: false,
                        },
                        bypassOnDebug: true,
                    },
                },
            ],
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: process.cwd(),
        }),
        extractLESS,
        ...htmlPlugins,
        new ConsolePlugin({
            filter: [],
            enable: isDevEnv,
        }),
        new UploadCdnPlugin({
            enable: doUploadCdn,
        }),
    ],
};

if (!isDevEnv) {
    module.exports.devtool = 'none';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
            },
        }),
        new OptimizeCSSAssetsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false,
            },
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
    ]);
}

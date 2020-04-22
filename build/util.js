const isDevEnv = process.env.NODE_ENV === 'development';
const isNoHash = process.env.NODE_NO_HASH;
const glob = require('glob');
const path = require('path');

exports.cdnPrefix = '';

exports.getHashedFileName = function (type) {
    switch (type) {
        case 'css':
            return function(getPath) {
                return getPath((isDevEnv || isNoHash) ? '[name]/css/index.css' : '[name]/css/index-[contenthash:8].css').replace('_data', '');
            };
        case 'img':
            return (isDevEnv || isNoHash) ? '[name].[ext]' : '[name]-[hash:8].[ext]';
        case 'js':
            return function (chunkData) {
                let chunkName = chunkData.chunk.name;
                if (chunkName.indexOf('data') >= 0) {
                    chunkName = chunkName.substring(0, chunkName.length - 5);
                    return isDevEnv ? `${chunkName}/js/data.js` : `${chunkName}/js/data.[chunkhash].js`;
                }
                return (isDevEnv || isNoHash) ? `${chunkName}/js/index.js` : `${chunkName}/js/index.[chunkhash].js`;
            }
        case 'chunkjs':
            return (isDevEnv || isNoHash) ? '[name].js' : '[name]-[chunkhash:8].js';
        default:
            return '';
    }
};

exports.getEntryConfigs = function() {
    const configs = {
        entrys: {},
        htmls: {},
    };
    const entrySets = ['data'];
    glob.sync('./src/pages/**/*.[jt]s?(x)').forEach(function (filePath) {
        const pageName = filePath.match(/src\/pages\/(.*)\/(.*)\.[tj]sx?/)[1];
        const fileName = filePath.match(/src\/pages\/(.*)\/(.*)\.[tj]sx?/)[2];
        const template = `./src/pages/${pageName}/index.html`;
        let entryKey = pageName;
        if (fileName === 'index') {
            configs.entrys[entryKey] = filePath;
        } else if (entrySets.indexOf(fileName) > -1) {
            entryKey = `${pageName}_${fileName}`;
            configs.entrys[entryKey] = filePath;
        } else {
            return;
        }
        if (configs.htmls[template]) {
            configs.htmls[template].chunks.push(entryKey);
        } else {
            configs.htmls[template] = {
                filename: path.resolve(__dirname, `../dist/${pageName}/index.html`),
                chunks: [entryKey],
            }
        }
    });
    return configs;
}
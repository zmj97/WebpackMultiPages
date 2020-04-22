const fs = require('fs');
const path = require('path');

class UploadCdnPlugin {
    constructor(options) {
        this.options = {
            enable: false, // 插件开关，默认“关”
            ...options,
        };
    }

    apply(compiler) {
        const enable = this.options.enable;
        if (enable) {
            const self = this;
            compiler.plugin('after-emit', function (compilation, cb) {
                self.readdirAndUpload(path.join(__dirname, '../dist'));
                cb();
            });
        }
    }

    readdirAndUpload(dirName) {
        const self = this;
        fs.readdir(dirName, function (err, paths) {
            if (err) {
                throw err;
            }
            paths.forEach(function(curPath) {
                curPath = `${dirName}/${curPath}`;
                if (fs.statSync(curPath).isFile()) {
                    const cdnDirPath = curPath.match(/.*\/dist\/(.*)\/.*?/)[1];
                    self.uploadCdn(curPath, cdnDirPath);
                } else {
                    self.readdirAndUpload(curPath);
                }
            });
        });
    }

    uploadCdn(curPath, cdnDirPath) {
        // upload file to cdn
    }
};

module.exports = UploadCdnPlugin;
const express = require('express');
const path = require('path');
const app = express();

app.listen(6660);

console.log('\n开发地址： http://test.corp.kuaishou.com:6660/\n')

app.use(express.static(path.join(__dirname, './../dist'), {
    lastModified: false,
    etag: false,
}));

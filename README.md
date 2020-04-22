### 分支相关
`master` -- 只有通用组件
`Archive` -- 所有页面的归档

### 启动
npm start

### 无压缩打包
npm run build:dev

### 线上打包(有哈希)
npm run build

### 线上打包(有哈希)并上传CDN
npm run build:cdn

### 线上打包(无哈希)
npm run build:nohash

### 其他
单页面默认入口为`index`.(js|ts|jsx|tsx)
可用`entrySets`配置更多入口，目前配置了`data`

# jquery-gulp-flow
基于jquery的多页面应用，gulp自动化打包
----------------------------------------
## 目录
```
src---//源码
  |--css  //样式文件 项目以sass为例
  |--fonts  //字体文件
  |--img   //图片文件
  |--js    //页面逻辑js 公共js
  |--static //静态文件 更新频率较低的工具js库等
  |--index.html //页面
```

## 编译

### `gulp`  
默认任务，执行所有打包命令并启动本地服务器

### `npm run dev`
监听文件变动，并执行打包，本地服务器预览


## GulpFile
1. sass编译，开发写样式时只需要写对应的px（像素）即可，打包时会自动转换成rem（vw适配的话可以自定制）
2. am-toast.js 一个自己写的toast小组件，包含常用的Loading和toast
3. 静态文件服务器里面开启了代理，用于处理本地开发中跨域的问题
4. 引入了font-min，用于压缩特殊字体文件，需要压缩的字体在根目录的config文件里面添加


## tips

后续会增加渲染模板支持，敬请期待

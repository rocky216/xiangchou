var path = require("path")
var express = require("express")
var webpack = require("webpack")
var WebpackDevMiddle = require("webpack-dev-middleware")
var WebpackHotMiddle = require("webpack-hot-middleware")
var  proxy = require('http-proxy-middleware');
var webpackConfig = require("../webpack.config")
var config = require("../config/index")
var app = express()
var compiler = webpack(webpackConfig)



app.use(proxy('/gushi/Api', {target: 'http://inv.lulxc.com/'}))

//设置静态资源
const staticPath=path.join(__dirname, "../dist")
app.use(express.static(staticPath));

const isDev = process.env.NODE_ENV=="development"?true:false
if (true) {
  app.set("view engine", 'ejs');
  app.set('views', __dirname + '/');

  //热更新
  app.use(WebpackDevMiddle(compiler,{
    publicPath: webpackConfig.output.publicPath,
    noInfo: true,
    stats: {
        colors: true //显示不同的颜色区分打包的文件
    },
  }))
  app.use(WebpackHotMiddle(compiler))
}else {
  app.set("view engine", 'ejs');
  app.set('views', __dirname + '/');
  // app.set('views', path.join(__dirname,"../dist"));
}



app.get("*", (req, res)=>{
  res.render('index', {})
})



app.listen(config.port, ()=>{
  console.log(`open： http://localhost:${config.port}/`);
})

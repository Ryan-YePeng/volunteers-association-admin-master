const webpack = require("webpack");
const settings = require("./src/settings");
const resolve = dir => require("path").join(__dirname, dir);

module.exports = {
  publicPath: settings.isHistory ? "/" : "./",
  outputDir: "dist",
  assetsDir: "static",
  indexPath: "index.html",
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: config => {
    const plugins = [];
    plugins.push(
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery"
      })
    );
    config.plugins = [...config.plugins, ...plugins];
    config.name = settings.title;
  },
  chainWebpack: config => {
    config.resolve.symlinks(true); // 修复HMR
    config.resolve.alias.set("@", resolve("src"));
    config.module
      .rule("svg")
      .exclude.add(resolve("src/assets/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/assets/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "./src/styles/index.scss";'
      }
    }
  },
  devServer: {
    open: false,
    host: "0.0.0.0",
    port: 8088,
    https: false,
    hotOnly: false,
    proxy: {
      "/api": {
        target: "http://192.168.0.109:8082/",
        // target: "http://111.230.246.168:8080",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
};

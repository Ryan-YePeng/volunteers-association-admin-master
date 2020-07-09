const webpack = require("webpack");
const settings = require("./src/settings");
const resolve = dir => require("path").join(__dirname, dir);
const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  publicPath: NODE_ENV === "production" && settings.isHistory ? "/" : "./", // (/绝对路径) (./相对路径)
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
    config.name = "阳江市马拉松协会";
  },
  chainWebpack: config => {
    config.resolve.symlinks(true); // 修复HMR
    config.resolve.alias.set("@", resolve("src"));
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");
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
    open: process.platform === "darwin",
    host: "0.0.0.0",
    port: 8088,
    https: false,
    hotOnly: false,
    proxy: {
      "/api": {
        // 目标:指向网络地址
        target: "http://192.168.0.128:8082/",
        // webpack属性，映射一个host
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
};

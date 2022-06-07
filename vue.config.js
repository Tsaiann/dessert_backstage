const path = require('path');

module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/dessert_backstage/' : './',
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve('src'),
        src: path.resolve('src'),
        utils: path.resolve('src/utils'),
        styles: path.resolve('src/styles'),
        assets: path.resolve('src/assets'),
        components: path.resolve('src/components'),
        services: path.resolve('src/services'),
        'vuex-store': path.resolve('src/store'),
      },
    },
  },
  css: {
    sourceMap: true,
    loaderOptions: {
      // pass options to sass-loader
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/api' : ''
        },
        ws: false,
      }
    }
    // ...
  }
}

//这个文件主要是各种文件的配置路径

module.exports = {
  css: {
    reset: require('!!file-loader?name=static/css/[name].[ext]!./css/reset.css'),
    fonts: require('!!file-loader?name=static/fonts/[name].[ext]!./fonts/iconfont.css'),
  },
  js: {
    html5shiv: require('!!file-loader?name=static/ie-fix/[name].[ext]!./ie-fix/html5shiv.min.js'),
    es5_sham: require('!!file-loader?name=static/ie-fix/[name].[ext]!./ie-fix/es5-sham.min.js'),
    es5_shim: require('!!file-loader?name=static/ie-fix/[name].[ext]!./ie-fix/es5-shim.min.js'),
    respond: require('!!file-loader?name=static/ie-fix/[name].[ext]!./ie-fix/respond.min.js'),
    jquery: require('!!file-loader?name=static/js/[name].[ext]!./js/jquery.min.js'),
  },
  img: {
    fzg_logo: require('!!file-loader?name=static/img/[name].[ext]!./img/fzg_logo.png'),
    erweima: require('!!file-loader?name=static/img/[name].[ext]!./img/erweima.png'),
    login_bg: require('!!file-loader?name=static/img/login/[name].[ext]!./img/login/login_bg.png'),
    sprites: require('!!file-loader?name=static/sprites/[name].[ext]!./sprites/sprites.png'),
  }
};
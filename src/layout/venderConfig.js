
module.exports = {
  css: {
    reset: require('!!file-loader?name=static/css/[name].[ext]!../static/css/reset.css'),
    fonts: require('!!file-loader?name=static/fonts/[name].[ext]!../static/fonts/iconfont.css'),
  },
  js: {
    html5shiv: require('!!file-loader?name=static/ie-fix/[name].[ext]!../static/ie-fix/html5shiv.min.js'),
    es5_sham: require('!!file-loader?name=static/ie-fix/[name].[ext]!../static/ie-fix/es5-sham.min.js'),
    es5_shim: require('!!file-loader?name=static/ie-fix/[name].[ext]!../static/ie-fix/es5-shim.min.js'),
    respond: require('!!file-loader?name=static/ie-fix/[name].[ext]!../static/ie-fix/respond.min.js'),
    jquery: require('!!file-loader?name=static/js/[name].[ext]!../static/js/jquery.min.js'),
  },
  img: {
    fzg_logo: require('!!file-loader?name=static/img/[name].[ext]!../static/img/fzg_logo.png'),
    erweima: require('!!file-loader?name=static/img/[name].[ext]!../static/img/erweima.png'),
  }
};
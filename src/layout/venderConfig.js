
module.exports = {
  css: {
    reset: require('!!file-loader?name=static/css/[name].[ext]!../static/css/reset.css'),
    fonts: require('!!file-loader?name=static/fonts/[name].[ext]!../static/fonts/iconfont.css'),
  },
  js: {
    html5shiv: require('!!file-loader?name=static/ie-fix/[name].[ext]!../static/ie-fix/html5shiv.min.js'),
    respond: require('!!file-loader?name=static/ie-fix/[name].[ext]!../static/ie-fix/respond.min.js'),
    jquery: require('!!file-loader?name=static/js/[name].[ext]!../static/js/jquery.js'),
  }
};

module.exports = {
  img: {
    fzg_logo: require('!!file-loader?name=static/img/[name].[ext]!../../static/img/fzg_logo.png'),  //注意后面这一段路径一定要写对，不然会报错
    login_bg: require('!!file-loader?name=static/img/login/[name].[ext]!../../static/img/login/login_bg.jpg'),
  },
};

//这个文件主要是各种文件的配置路径，注意文件的路径、文件的后缀千万要写正确，不然编译不通过，而且报错不明白，很痛苦

const merge = require('webpack-merge');

let img = {
            //login_bg: require('!!file-loader?name=static/img/login/[name].[ext]!./img/login/login_bg.jpg'),
            login_bg: rPath('img/login/login_bg.jpg'),
            sprites: rPath('sprites/sprites.png'),
            favicon: rPath('favicon.ico'),

            //静态页酒店图片
            tmp_banner: rPath('img/index/tmp_banner.jpg'),
          };

function getTmpImgs(){
  let imgObj = {};

  for(let i = 1; i < 25; i++){
    imgObj['h' + i] = rPath('img/index/h' + i + '.jpg');
  }

  return imgObj;
}

function rPath(path){
  return process.env.NODE_ENV === 'production' ? '../static/' + path
                                               : '../static/' + path;
}

module.exports = {
  css: {
    reset: require('!!file-loader?name=static/css/[name].[ext]!./css/reset.css'),
    fonts: require('!!file-loader?name=static/fonts/[name].[ext]!./fonts/iconfont.css'),
    swiper: require('!!file-loader?name=static/css/[name].[ext]!./css/swiper.min.css'),               //3.x版本
  },
  js: {
    html5shiv: rPath('ie-fix/html5shiv.min.js'),
    es5_sham: rPath('ie-fix/es5-sham.min.js'),
    es5_shim: rPath('ie-fix/es5-shim.min.js'),
    respond: rPath('ie-fix/respond.min.js'),
    jquery: rPath('js/jquery.min.js'),
  },
  img: merge(img, getTmpImgs()),
   
};

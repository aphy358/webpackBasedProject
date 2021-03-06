
//这个文件主要是各种文件的配置路径，注意文件的路径、文件的后缀千万要写正确，不然编译不通过，而且报错不明白，很痛苦

const merge = require('webpack-merge');

let img = {
            login_bg: require('!!file-loader?name=static/img/login/[name].[ext]!./img/login/login_bg.jpg'),
            sprites: require('!!file-loader?name=static/sprites/[name].[ext]!./sprites/sprites.png'),
            favicon: require('!!file-loader?name=static/[name].[ext]!./favicon.ico'),

            //静态页酒店图片
            tmp_banner: require('!!file-loader?name=static/img/index/[name].[ext]!./img/index/tmp_banner.jpg'),
            //酒店图片获取不到时默认加载的图片
            nopic: require('!!file-loader?name=static/img/[name].[ext]!./img/nopic.png'),
            nopic1: require('!!file-loader?name=common/images/[name].[ext]!./img/nopic.png'),
          };

function getTmpImgs(){
  let imgObj = {};

  for(let i = 1; i < 25; i++){
    imgObj['h' + i] = require('!!file-loader?name=static/img/index/[name].[ext]!./img/index/h' + i + '.jpg');
  }

  return imgObj;
}

module.exports = {
  css: {
    reset: require('!!file-loader?name=static/css/[name].[ext]!./css/reset.css'),
    fonts: require('!!file-loader?name=static/fonts/[name].[ext]!./fonts/iconfont.css'),
    swiper: require('!!file-loader?name=static/css/[name].[ext]!./css/swiper.min.css'),               //3.x版本
    datepick: require('!!file-loader?name=static/fonts/[name].[ext]!./css/datepick.css'),
  },
  js: {
    html5shiv: require('!!file-loader?name=static/ie-fix/[name].[ext]!./ie-fix/html5shiv.min.js'),
    es5_sham: require('!!file-loader?name=static/ie-fix/[name].[ext]!./ie-fix/es5-sham.min.js'),
    es5_shim: require('!!file-loader?name=static/ie-fix/[name].[ext]!./ie-fix/es5-shim.min.js'),
    respond: require('!!file-loader?name=static/ie-fix/[name].[ext]!./ie-fix/respond.min.js'),
    jquery: require('!!file-loader?name=static/js/[name].[ext]!./js/jquery.min.js'),
    datepickPacked: require('!!file-loader?name=static/js/datePick/[name].[ext]!./js/datePick/datepickPacked.js'),
    validator: require('!!file-loader?name=static/js/validator/[name].[ext]!./js/validator/validatorPacked.js'),
  },
  img: merge(img, getTmpImgs()),
  layer: {    //layer 相关的文件
    source0: require('!!file-loader?name=static/js/skin/default/[name].[ext]!./js/skin/default/icon.png'),
    source1: require('!!file-loader?name=static/js/skin/default/[name].[ext]!./js/skin/default/icon-ext.png'),
    source2: require('!!file-loader?name=static/js/skin/default/[name].[ext]!./js/skin/default/layer.css'),
    source3: require('!!file-loader?name=static/js/skin/default/[name].[ext]!./js/skin/default/loading-0.gif'),
    source4: require('!!file-loader?name=static/js/skin/default/[name].[ext]!./js/skin/default/loading-1.gif'),
    source5: require('!!file-loader?name=static/js/skin/default/[name].[ext]!./js/skin/default/loading-2.gif'),
  }
};

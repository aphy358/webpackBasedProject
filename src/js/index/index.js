//全局变量Promise，兼容ie
window.Promise = require('es6-promise');

//引入样式文件
require('../../sass/header.scss');
require('../../sass/footer.scss');
require('../../static/fonts/iconfont.css');
require('../../static/css/swiper.min.css');
require('../../sass/index/index.scss');

//引入模板文件
const hotelRecommandsT = require('../../html/index/templates/hotelRecommands.T.ejs');

//引入js文件
const banner = require('./banner.js');

//处理轮播初始化
banner.isIE() ? banner.swiperOnIE() : banner.loadSwiper();

setTimeout(function(){

    let data = {cities: ['深圳','珠海','香港','东莞','上海','北京']};

    $('#testT').html( hotelRecommandsT(data) );
}, 10);

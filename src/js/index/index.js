window.Promise = require('es6-promise');    //全局变量Promise，兼容ie
require('../../sass/header.scss');
require('../../sass/footer.scss');
require('../../static/fonts/iconfont.css');
require('../../static/css/swiper.min.css');
require('../../sass/index/index.scss');

//异步加载 swiper 插件
require.ensure(['swiper.jquery.min'], function(){
    
    require('swiper.jquery.min');
    
    //IE6/7/8不兼容，IE9/10下勉强能用，但表现不佳。后期如要改进，可能要重写该插件。
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplay: 5000,								//可选选项，自动滑动
        autoplayDisableOnInteraction: false,		//轮播区域滑动、点击底部控制条不中断轮播
    });
}, 'swiper');
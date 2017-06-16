
//首页 banner 区域相关 js

var timeOut = null;

module.exports = {

    //判断是否是IE浏览器
    isIE: function(){ return !!window.ActiveXObject || "ActiveXObject" in window; },

    //如果是非IE浏览器，则异步加载swiper.js，并初始化swiper
    loadSwiper: function(){
        require.ensure(['swiper.jquery.min'], function(){
            
            require('swiper.jquery.min');

            //IE6/7/8不兼容，IE9/10下勉强能用，但表现不佳。其他浏览器没测...
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                autoplay: 5000,								//可选选项，自动滑动
                autoplayDisableOnInteraction: false,		//轮播区域滑动、点击底部控制条不中断轮播
            });
        }, 'swiper');
    },

    //若果是IE浏览器，则另行处理，只为兼容...
    swiperOnIE: function(){

        var slideArr = $(".swiper-slide"),
            paginationStr = '';

        for(let i = 0; i < slideArr.length; i++){
            paginationStr += '<span class="swiper-pagination-bullet"></span>';
        }

        if( paginationStr !== '' ){
            
            //初始化并设置banner区域相关DOM的class
            initBannerDom();

            //开启定时器，进行banner图片的切换显示
            slideTimeOut();

            //初始化banner分页条的鼠标移进移出事件
            initMouseEvent();
        }
        
    },

}

//初始化并设置banner区域相关DOM的class
function initBannerDom(){
    $(".swiper-container").addClass('swiper-container-horizontal');
    $(".swiper-pagination").append(paginationStr);
    $($(".swiper-slide")[0]).addClass('swiper-slide-active');
    $($(".swiper-pagination-bullet")[0]).addClass('swiper-pagination-bullet-active');
}

//开启定时器，进行banner图片的切换显示
function slideTimeOut(){

    timeOut = setTimeout(function(){

        var nextSlide = $(".swiper-slide-active").next('.swiper-slide');
        $(".swiper-slide-active").removeClass('swiper-slide-active');
        nextSlide.length > 0 ? nextSlide.addClass('swiper-slide-active')
                             : $($(".swiper-slide")[0]).addClass('swiper-slide-active');

        var nextBullet = $(".swiper-pagination-bullet-active").next('.swiper-pagination-bullet');
        $(".swiper-pagination-bullet-active").removeClass('swiper-pagination-bullet-active');
        nextBullet.length > 0 ? nextBullet.addClass('swiper-pagination-bullet-active')
                              : $($(".swiper-pagination-bullet")[0]).addClass('swiper-pagination-bullet-active');

        slideTimeOut();

    }, 1000);
}

//初始化banner分页条的鼠标移进移出事件
function initMouseEvent(){
    $(".swiper-slide").on('mouseover mouseenter', function(){
        clearTimeout(timeOut);
    });

    $(".swiper-slide").on('mouseout mouseleave', function(){
        if( !timeOut )  slideTimeOut();
    });
}
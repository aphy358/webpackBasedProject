
//首页 banner 区域相关 js
module.exports = {
    run: function(){
        _isIE() ? _swiperOnIE()
                : _loadSwiper();
    }
}

let timeOut = null;

//判断是否是IE浏览器
function _isIE(){ return !!window.ActiveXObject || "ActiveXObject" in window; }

//如果是非IE浏览器，则异步加载swiper.js，并初始化swiper
function _loadSwiper(){
    require.ensure([], function(){

        require('swiper');

        //IE6/7/8不兼容，IE9/10下勉强能用，但表现不佳。其他浏览器没测...
        let swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            autoplay: 5000,								//可选选项，自动滑动
            autoplayDisableOnInteraction: false,		//轮播区域滑动、点击底部控制条不中断轮播
        });
    }, 'swiper');
}

//若果是IE浏览器，则另行处理，只为兼容...
function _swiperOnIE(){

    let slideArr = $(".swiper-slide"),
        paginationStr = '';

    for(let i = 0; i < slideArr.length; i++){
        paginationStr += '<span class="swiper-pagination-bullet" data-index="' + i + '"></span>';
    }

    if( paginationStr !== '' ){

        //初始化并设置banner区域相关DOM的class
        _initBannerDom(paginationStr);

        //开启定时器，进行banner图片的切换显示
        if( slideArr.length > 1 ) _slideTimeOut();

        //初始化banner分页条的鼠标移进移出事件
        _initMouseEvent();
    }
}

//初始化并设置banner区域相关DOM的class
function _initBannerDom(paginationStr){
    
    $(".swiper-container").addClass('swiper-container-horizontal');
    $(".swiper-pagination").append(paginationStr);

    $(".swiper-slide").each(function(i, o){
        i === 0 ? $(o).addClass('swiper-slide-active')
                : $(o).addClass('hidden');
    });

    $($(".swiper-pagination-bullet")[0]).addClass('swiper-pagination-bullet-active');
}

//开启定时器，进行banner图片的切换显示
function _slideTimeOut(){

    timeOut = setTimeout(function(){

        let nextSlide = $(".swiper-slide-active").next('.swiper-slide');
        $(".swiper-slide-active").removeClass('swiper-slide-active').addClass('hidden');
        nextSlide.length > 0 ? nextSlide.addClass('swiper-slide-active').removeClass('hidden')
                             : $($(".swiper-slide")[0]).addClass('swiper-slide-active').removeClass('hidden');

        let nextBullet = $(".swiper-pagination-bullet-active").next('.swiper-pagination-bullet');
        $(".swiper-pagination-bullet-active").removeClass('swiper-pagination-bullet-active');
        nextBullet.length > 0 ? nextBullet.addClass('swiper-pagination-bullet-active')
                              : $($(".swiper-pagination-bullet")[0]).addClass('swiper-pagination-bullet-active');

        _slideTimeOut();

    }, 5000);
}

//初始化banner分页条的鼠标点击事件
function _initMouseEvent(){
    $(".swiper-pagination-bullet").on('click', function(){

        $(".swiper-pagination-bullet").removeClass('swiper-pagination-bullet-active');
        $(this).addClass('swiper-pagination-bullet-active');

        let index = $(this).attr('data-index');
        let img = $('.swiper-slide')[index];
        $('.swiper-slide').addClass('hidden');
        $(img).removeClass('hidden');

        clearTimeout(timeOut);
        _slideTimeOut();
    });
}

//首页搜索栏 相关 js
module.exports = {
    run: function(){
        //初始化搜索框点击切换事件，酒店、门票、手机版
        _initSearchTypeSwithClick();
    }
}

//初始化搜索框点击切换事件，酒店、门票、手机版
function _initSearchTypeSwithClick(){
	$("li.s-tab-item").on('click', function(){
		var _this = $(this);
		if( _this.hasClass('current') )		return;
		
		_this.parent().find('.s-tab-item').removeClass('current');
		_this.addClass('current');
		
		var target = _this.attr('data-for');
		var arr = $('.s-box-wrap .s-box');
		arr.removeClass('current');
		arr.filter(function(i, o){ return $(o).attr('data-target') == target; })
		   .addClass('current');
	});
}
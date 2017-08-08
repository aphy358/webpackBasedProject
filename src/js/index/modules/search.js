
//首页搜索栏 相关 js
module.exports = {
    run: function(){

		//填充搜索框的 html
		fillSearchHtml()

        //初始化搜索框点击切换事件，酒店、门票、手机版
        initSearchTypeSwithClick();
    }
}

//引入模板文件
const searchT = require('../templates/search.T.ejs');

//填充搜索框的 html
function fillSearchHtml(){
	$("#searchWrap").html( searchT() );
}

//初始化搜索框点击切换事件，酒店、门票、手机版
function initSearchTypeSwithClick(){
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
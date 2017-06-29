
//首页 国内酒店、国外酒店 相关 js
module.exports = {
    run: function(){
        //加载国内酒店
        _loadInternalAds();

        //初始化 国内酒店、国际酒店 点击切换事件
        _initNationSwithClick();
    }
}

//引入模板文件
const internalRecommandsT = require('../templates/internalRecommands.T.ejs');

//引入测试数据
let internalRecommandsD = require('../testData/internalRecommands.D');

//加载国内酒店
function _loadInternalAds(){
    // $.getJSON('/user/indexInternalhotelData.do', function(data){
        if( internalRecommandsD.returnCode === 1 ){
            $("#internalRecommandsWrap").html( internalRecommandsT({ arr : internalRecommandsD.data.gnAds }) );
        }
    // })
}

//初始化 国内酒店、国际酒店 点击切换事件
function _initNationSwithClick(){
	$(".ads-title-item").on('click', function(){
		var _this = $(this);
		if( _this.hasClass('current') )		return;
		
		_this.parent().find('.ads-title-item').removeClass('current');
		_this.addClass('current');
		
		var target = _this.attr('data-for');
		var arr = _this.parent().parent().find('.toggle-show');
		arr.addClass('hidden');
		arr.filter(function(i, o){ return $(o).attr('data-target') == target; })
		   .removeClass('hidden');
	});
}
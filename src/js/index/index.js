//全局变量Promise，兼容ie
window.Promise = require('es6-promise');

//引入样式文件
require('../../sass/header.scss');
require('../../sass/footer.scss');
require('../../static/css/swiper.min.css');
require('../../sass/index/index.scss');

//引入js文件，并执行入口函数
require('./modules/banner.js').run();
require('./modules/search.js').run();

//引入模板文件
const hotSalesT = require('../../html/index/templates/hotSales.T.ejs');
const internalRecommandsT = require('../../html/index/templates/internalRecommands.T.ejs');

//引入测试数据
let hotSeasonD = require('./testData/hotSeason.D');
let internalRecommandsD = require('./testData/internalRecommands.D');


//加载当季热销
// $.getJSON('/user/indexHotSeasonData.do', function(data){
    if( hotSeasonD.returnCode === 1 ){
        $("#hotSalesWrap").html( hotSalesT({ arr : hotSeasonD.data }) );
    }
// })


//加载国内酒店
// $.getJSON('/user/indexInternalhotelData.do', function(data){
    if( internalRecommandsD.returnCode === 1 ){
        $("#internalRecommandsWrap").html( internalRecommandsT({ arr : internalRecommandsD.data.gnAds }) );
    }
// })

$(()=>{
	$(".ads-title-item").on('click', function(){
		debugger;
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
});
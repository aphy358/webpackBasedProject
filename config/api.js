

//所有被代理的api

let proxy_addr = 'http://192.168.101.60:8083';
let ex = {};

var test = [
	'/user/indexMainData.do',					//主页主广告
	
	'/user/indexHotSeasonData.do',				//当季热销
	'/user/indexInternalhotelData.do',			//国内酒店
	'/user/indexForeignhotelData.do',			//国际酒店
	'/user/indexTicketData.do',					//景点门票
	'/user/indexPromotionalSaleData.do',		//促销特卖
	'/user/indexSellWellMonthData.do',			//本月热销

].forEach(function(o, i){
	ex[o] = proxy_addr;
})

module.exports = ex;
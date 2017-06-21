

//所有被代理的api

let proxy_addr = 'http://192.168.101.60:8083';

module.exports = {
	
	'/user/indexMainData.do' : proxy_addr,					//主页主广告
	
	'/user/indexHotSeasonData.do' : proxy_addr,				//当季热销
	'/user/indexInternalhotelData.do' : proxy_addr,			//国内酒店
	'/user/indexForeignhotelData.do' : proxy_addr,			//国际酒店
	'/user/indexTicketData.do' : proxy_addr,				//景点门票
	'/user/indexPromotionalSaleData.do' : proxy_addr,		//促销特卖
	'/user/indexSellWellMonthData.do' : proxy_addr,			//本月热销
	
}

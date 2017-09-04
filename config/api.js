//所有被代理的api
//let proxy_addr = 'http://192.168.101.60:8083';
let proxy_addr = 'http://192.168.101.83:4000';
let ex = {};

var test = [
	'/user/indexMainData.do',					//主页主广告

	'/user/indexHotSeasonData.do',				//当季热销
	'/user/indexInternalhotelData.do',			//国内酒店
	'/user/indexForeignhotelData.do',			//国际酒店
	'/user/indexTicketData.do',					//景点门票
	'/user/indexPromotionalSaleData.do',		//促销特卖
	'/user/indexSellWellMonthData.do',			//本月热销


	//确认酒店是否下线
	'/internalOrder/check.do',

	//获取页面主要信息
	'/order/write.do',

	//获取加床、加早、加宽带信息、
	'/order/surchargeRoom.do',
  
	//获取护照国籍信息
	'/order/countrySuggest.do',
	  
	//验证酒店价格是否适合于某国际客户
	'/order/properMarket.do',

	//用户确认订单信息后进行验价
	'/order/orderValidate.do',


].forEach(function (o, i) {
	ex[o] = proxy_addr;
});

module.exports = ex;

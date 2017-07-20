const banner            = require('./modules/banner.ejs');
const search            = require('./modules/search.ejs');
const hotSales          = require('./modules/hotSales.ejs');
const hotelRecommands   = require('./modules/hotelRecommands.ejs');
const ticket            = require('./modules/ticket.ejs');
const promotion         = require('./modules/promotion.ejs');
const pageContent       = require('./index.ejs');

const staticConfig      = require('../../static/staticConfig');
const layout            = require('../../layout/layout');
const pageTitle         = '房掌柜 · 首页';

let params = {
    banner:          banner({staticConfig}),                     //banner（千万记得参数是一个对象）
    search:          search(),                                   //搜索框
    hotSales:        hotSales({staticConfig}),                   //当季热销
    hotelRecommands: hotelRecommands({staticConfig}),            //国内酒店、国际酒店
    ticket:          ticket({staticConfig}),                     //景点门票
    promotion:       promotion({staticConfig}),                  //促销特卖
}

module.exports = layout.run(pageTitle, pageContent(params));
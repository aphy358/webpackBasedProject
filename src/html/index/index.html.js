const banner = require('./chunks/banner.ejs');
const search = require('./chunks/search.ejs');
const hotSales = require('./chunks/hotSales.ejs');
const hotelRecommands = require('./chunks/hotelRecommands.ejs');
const ticket = require('./chunks/ticket.ejs');
const promotion = require('./chunks/promotion.ejs');
const pageContent = require('./index.ejs');

const staticConfig = require('../../static/staticConfig');
const layout = require('../../layout/layout');
const pageTitle = '房掌柜 · 首页';

const params = {
    staticConfig,
    banner: banner({staticConfig}),                     //banner（千万记得参数是一个对象）
    search: search(),                                   //搜索框
    hotSales: hotSales({staticConfig}),                 //当季热销
    hotelRecommands: hotelRecommands({staticConfig}),   //国内酒店、国际酒店
    ticket: ticket({staticConfig}),                     //景点门票
    promotion: promotion({staticConfig}),               //促销特卖
}

module.exports = layout.run(pageTitle, pageContent(params));
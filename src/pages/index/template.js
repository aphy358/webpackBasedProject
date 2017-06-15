var banner = require('./chunks/banner.ejs');
var search = require('./chunks/search.ejs');
var hotSales = require('./chunks/hotSales.ejs');
var hotelRecommands = require('./chunks/hotelRecommands.ejs');
var ticket = require('./chunks/ticket.ejs');


var staticConfig = require('../../static/staticConfig');
var pageContent = require('./index.ejs');
var layout = require('../../layout/layout');
var pageTitle = '房掌柜 · 首页';

var params = {
    staticConfig,
    banner: banner({staticConfig}),                     //banner（千万记得参数是一个对象）
    search: search(),                                   //搜索框
    hotSales: hotSales({staticConfig}),                 //当季热销
    hotelRecommands: hotelRecommands({staticConfig}),   //国内酒店、国际酒店
    ticket: ticket({staticConfig}),                     //景点门票
}

module.exports = layout.run(pageTitle, pageContent(params));
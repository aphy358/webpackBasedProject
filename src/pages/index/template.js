var banner = require('./content/banner.ejs');
var search = require('./content/search.ejs');


var staticConfig = require('../../static/staticConfig');
var content = require('./content.ejs');
var layout = require('../../layout/layout');
var pageTitle = '房掌柜 · 首页';

var params = {
    staticConfig,
    banner: banner({staticConfig}),     //千万记得参数是一个对象
    search: search(),
}

module.exports = layout.run(pageTitle, content(params));
var content = require('./content.ejs');
var layout = require('../../layout/layout');
var staticConfig = require('../../static/staticConfig');
var pageTitle = '房掌柜 · 登录';

module.exports = layout.run(pageTitle, content({staticConfig}), 'no_Header_Footer');
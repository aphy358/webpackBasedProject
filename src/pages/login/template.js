var content = require('./content.ejs');
var layout = require('../../layout/layout');
var venderConfig = require('./venderConfig.js');
var pageTitle = '房掌柜 · 登录';

module.exports = layout.run(pageTitle, content({venderConfig}), 'no_Header_Footer');
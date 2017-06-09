var content = require('./content.ejs');
var layout = require('../../layout/layout');
var pageTitle = '房掌柜.首页';

module.exports = layout.run(pageTitle, content());
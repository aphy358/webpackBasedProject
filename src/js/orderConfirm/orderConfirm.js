//全局变量Promise，兼容ie
window.Promise = require('es6-promise');

require('../../static/css/reset.css');
require('../../sass/orderConfirm/orderConfirm.scss');
require('../../sass/orderConfirm/confirmDialog.scss');
require('../../sass/header.scss');
require('../../sass/footer.scss');
require('../../static/css/tooltip_m.css');


//页面初始化
require('./modules/initPage.js').run();

//页面主交互逻辑
require('./modules/initActive.js').run();

//引入表单验证插件
// require('../../static/js/tooltip_m.js');
// require('../../static/js/jquery.validate.js');

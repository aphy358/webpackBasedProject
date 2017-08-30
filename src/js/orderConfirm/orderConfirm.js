//全局变量Promise，兼容ie
window.Promise = require('es6-promise');

require('../../static/css/tooltip_m.css');
require('../../static/css/datepick.css');
require('../../static/css/reset.css');
require('../../sass/header.scss');
require('../../sass/footer.scss');
//主页面样式
require('../../sass/orderConfirm/orderConfirm.scss');
//提示用户加床数达最大值时的弹出框的样式
require('../../sass/orderConfirm/confirmDialog.scss');
//确认订单信息弹框的样式
require('../../sass/orderConfirm/confirmOrderMsg.scss');

const Util = require('../../common/util');

//页面初始化
require('./modules/initPage.js').run();

const initActive = require('./modules/initActive.js').run;

//IE9以下和IE9以上的浏览器采用不同方式加载插件（日期控件、验证控件）
if( Util.ltIE9() ){
    Util.loadAsync(['../static/js/datePick/datepickPacked.js', '../static/js/validator/validatorPacked.js'], initActive);
}else{
    require.ensure([], function(){
        require('../../static/js/datePick/datepickPacked');
        require('../../static/js/validator/validatorPacked');

        initActive();
    }, 'validator');
}

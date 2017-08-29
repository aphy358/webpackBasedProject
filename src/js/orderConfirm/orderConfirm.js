//全局变量Promise，兼容ie
window.Promise = require('es6-promise');

require('../../static/css/reset.css');
require('../../sass/orderConfirm/orderConfirm.scss');
require('../../sass/orderConfirm/confirmDialog.scss');
require('../../sass/header.scss');
require('../../sass/footer.scss');
require('../../static/css/tooltip_m.css');
require('../../static/css/datepick.css');


const Util = require('../../common/util');

//页面初始化
require('./modules/initPage.js').run();



if( Util.ltIE9() ){
    Util.appendScript_ltIE9(['../static/js/datePick/datepickPacked.js', '../static/js/validator/validatorPacked.js'], initActive);
}else{
    require.ensure([], function(){
        require('../../static/js/datePick/datepickPacked');

        require('../../static/js/validator/validatorPacked');

        initActive();
    }, 'validator');
}


function initActive(){
    //页面主交互逻辑
    require('./modules/initActive.js').run();
}
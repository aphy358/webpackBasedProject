
const
    // 引入公共函数
    Util = require('../../../common/util'),

    // 引入订单页面主模板
    orderMain = require('../templates/orderMain.ejs'),

    // 引入入住信息结构
    guestMsg = require('../templates/guestMessage.ejs'),

    // 分别引入加床、加早、加宽模块
    addBreakfast = require('./addBreakfast.js'),
    addBed       = require('./addBed.js'),
    addNetwork   = require('./addNetwork.js'),

    // 判断酒店是否在线（或者说是否已下线）
    isHotelOnline = require('./sendRequest.js').isHotelOnline,

    // 获取初始化信息
    getInitData = require('./sendRequest.js').getInitData;



// 开始初始化页面（先判断酒店是否在线）
function initPage() {

    // 先用空数据把页面撑起来，提高用户体验，后续再用真实数据填充页面
    $('.main').html( orderMain( require('../testData/initPageMockData') ) );

    isHotelOnline(function (res) {
        if (res.isOnline) {
            // 如果酒店在线，请求各个接口，并将返回的数据经模板处理后再填充页面（初始化页面）
            invokeAPIs();
        } else {
            // 酒店已下线时，提醒客户，然后关闭窗口
            alert('该酒店已下线',function(){
                CloseWebPage();
            });
        }
    });
}



// 关闭窗口（兼容各个浏览器）
function CloseWebPage() {
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            window.opener = null;
            window.close();
        }
        else {
            window.open('', '_top');
            window.top.close();
        }
    }
    else if (navigator.userAgent.indexOf("Firefox") > 0) {
        // 火狐默认状态非window.open的页面window.close是无效的
        window.location.href = 'about:blank ';
    }
    else {
        window.opener = null;
        window.open('', '_self', '');
        window.close();
    }
}



// 请求各个接口，并将返回的数据经模板处理后再填充页面（初始化页面）
function invokeAPIs( initHtml ) {
    
    // 获取订单初始信息，并填充到页面
    getOrderInitData();

    // 获取 加床、加早、加宽带 模块，并填充到页面（如果有这些模块）
    addBreakfast();
    addBed();
    addNetwork();
}



// 获取订单初始信息，并填充到页面
function getOrderInitData() {

    getInitData(function (res) {

        if (res.success == true) {

            // 将返回结果存入全局变量，以便后续取用
            $.orderInfo = res;

            res.content.paymentTermName = ["客人前台现付", '单结', '周结', '半月结', '月结', '不固定', '三日结', '十日结', '额度结'];

            // 先用一些初始化的数据填充页面
            $('.main').html( orderMain(res.content) );

            // 再将入住人信息填充到页面中
            $('.guest-msg-box').html( guestMsg(res) );

            // 异步加载插件（验证插件、日期插件），这个过程依赖 $.orderInfo
            loadScriptsAsync();

            // ie10以下的placeholder兼容
            window.placeholder();
        }
    });
}



// 异步加载插件（验证插件、日期插件）
function loadScriptsAsync(){

    // IE9以下和IE9以上的浏览器采用不同方式加载插件（日期控件、验证控件）
    if ( Util.ltIE9() ) {
        
        // 引入页面主交互逻辑
        const initActive = require('./initActive.js').run;

        Util.loadAsync(
            [
                '../../webpacked/static/js/datePick/datepickPacked.js', 
                '../../webpacked/static/js/validator/validatorPacked.js'
            ], 
            initActive
        );

    } else {

        require.ensure([], function () {

            // 引入页面主交互逻辑
            const initActive = require('./initActive.js').run;

            require('../../../static/js/datePick/datepickPacked');
            require('../../../static/js/validator/validatorPacked');

            initActive();

        }, 'validator');
    }
}



module.exports = {
    run : initPage
};

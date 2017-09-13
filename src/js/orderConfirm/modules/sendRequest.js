//用于获取页面主要信息的数据的模块

//引入工具类
const queryString = require('../../../common/util.js').queryString;

//用于请求酒店是否下线的函数
function isHotelOnline(callback) {
    var checkParams = {
        hotelId: queryString('hotelId'),
        suppId: queryString('supplierId')
    };
    $.post('/internalOrder/check.do', checkParams, function (data) {
        callback(data);
    });
}

// 获取订单页面的初始化信息
function getInitData(callback, roomNum) {
    //请求页面中用于显示信息的数据
    //获取参数
    var writeParams = {
        childrenAgesStr: queryString('childrenAgesStr'),
        childrenNum: queryString('childrenNum'),
        adultNum: queryString('adultNum'),
        citytype: queryString('citytype'),
        isQueryPrice: queryString('isQueryPrice'),
        rateType: queryString('rateType'),
        breakFastId: queryString('breakFastId'),
        roomNum: roomNum || queryString('roomNum'),
        paymentType: queryString('paymentType'),
        hotelId: queryString('hotelId'),
        supplierId: queryString('supplierId'),
        endDate: queryString('endDate'),
        startDate: queryString('startDate'),
        roomId: queryString('roomId'),
        staticInfoId: queryString('staticInfoId')
    };
    $.post('/order/write.do', writeParams, function (data) {
        callback(data);
    });
}


//请求护照国籍信息
function getNationalMsg(key, callback) {
    $.get('/order/countrySuggest.do', { 'key': key }, function (data) {
        callback(data);
    })
}

//验证酒店价格是否适合于某国际客户
function isProperMarket(countryId, callback) {
    $.get('/order/properMarket.do',
        { 'suppId': queryString('supplierId'), 'countryId': countryId },
        function (data) {
            callback(data);
        })
}

function checkThePrice(params, callback) {
    var settings = {
        type: "POST",
        url: '/order/orderValidate.do',
        data: params,
        success: function (data) {
            callback(data);
        }
    };
    $.ajax(settings);
}

//验价成功后，保存订单
function saveOrder(params, callback) {
    $.post('/order/saveOrder.do', params, function (data) {
        callback(data);
    })
}


/**
 * 加床、加早、加宽带的ajax公共函数
 * @param {*} cb 回调函数
 * @param {*} flag 1：加早；2：加床；3：加宽带 
 */
function loadBBN(cb, flag) {
    var params = {
        startDate  : queryString('startDate'),
        endDate    : queryString('endDate'),
        infoId     : queryString('staticInfoId'),
        suppId     : queryString('supplierId'),
        roomtypeId : queryString('roomId'),
        roomNum    : queryString('roomNum'),
        typeId     : flag
    };
    
    $.post('/order/surchargeRoom.do', params, function (res) {
        cb(res);
    });
}


/**
 * 加床、加早、加宽带 的公共渲染函数
 * @param {*} context 这里指相关 DOM 的类名，将 htmlStr 渲染到指定 DOM
 * @param {*} htmlStr 用于渲染页面的 html 字符串
 */
function renderBBN(context , htmlStr){
    if( !$.orderInfo ){
        setTimeout(function() {
            renderBBN(context , htmlStr);
        }, 100);
    }else{
        // 当 $.orderInfo 有值则说明已经完成了页面初步初始化，就可以在页面找到 '.network-msg-box' 元素
        $('.main').find(context)
                  .show()
                  .html(htmlStr);
    }
}

module.exports = {
    isHotelOnline  : isHotelOnline,
    getInitData    : getInitData,
    getNationalMsg : getNationalMsg,
    isProperMarket : isProperMarket,
    checkThePrice  : checkThePrice,
    saveOrder      : saveOrder,
    loadBBN        : loadBBN,
    renderBBN      : renderBBN
};

//用于获取页面主要信息的数据的模块

//引入工具类
const queryString = require('../../../common/util.js').queryString;

//用于请求酒店是否下线的函数
function getCheck(callback) {
    var checkParams = {
        hotelId: queryString('hotelId'),
        suppId: queryString('supplierId')
    };
    $.post('/internalOrder/check.do', checkParams, function (data) {
        callback(data);
    });
}

//用于请求页面中主要信息的函数
function getWrite(callback,roomNum) {
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

//用于请求加早信息的函数
function getPrice(callback,typeId) {
  var breakfastParams = {
    startDate : queryString('startDate'),
    endDate : queryString('endDate'),
    infoId : queryString('staticInfoId'),
    suppId : queryString('supplierId'),
    roomtypeId : queryString('roomId'),
    roomNum : queryString('roomNum'),
    typeId : typeId
  };
  $.post('/order/surchargeRoom.do',breakfastParams,function (data) {
    callback(data);
  })
}

//请求护照国籍信息
function getNationalMsg(key,callback) {
  $.get('/order/countrySuggest.do',{ 'key' : key },function (data) {
    callback(data);
  })
}


module.exports = {
  getCheck : function (callback) {
    getCheck(callback);
  },
  getWrite : function (callback,roomNum) {
    getWrite(callback,roomNum);
  },
  getPrice : function (callback,typeId) {
    getPrice(callback,typeId);
  },
  getNationalMsg : function (key,callback) {
    getNationalMsg(key,callback);
  }
};
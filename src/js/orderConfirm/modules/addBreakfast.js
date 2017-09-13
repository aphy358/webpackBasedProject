const addBreakfastStr = require('../templates/addBreakfast.ejs');

//获取加早的数据
const getParamsForExtraService = require('./sendRequest.js').getParamsForExtraService;

// 引入公共函数
Util = require('../../../common/util');

//将替换好的html结构添加到页面指定位置中
function addBreakfast() {

    var params = getParamsForExtraService(1);

    $.post('/order/surchargeRoom.do', params, function (res) {

        if (res.result == "success") {

            res.startDate = Util.queryString('startDate');
            res.endDate = Util.queryString('endDate');
            
            var htmlStr = addBreakfastStr(res);

            $('.main').find('.breakfast-msg-box')
                      .show()
                      .html(htmlStr);
        }
    })
}

module.exports = addBreakfast;

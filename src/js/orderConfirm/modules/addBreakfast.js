const addBreakfastStr = require('../templates/addBreakfast.ejs');

//获取加早的数据
const getParamsForExtraService = require('./sendRequest.js').getParamsForExtraService;

//将替换好的html结构添加到页面指定位置中
function addBreakfast() {

    var params = getParamsForExtraService(1);

    $.post('/order/surchargeRoom.do', params, function (res) {

        if (res.result == "success") {

            const orderInfo = $.orderInfo;
            
            if( orderInfo ){
                res.startDate = orderInfo.content.startDate;
                res.endDate = orderInfo.content.endDate;
    
                var htmlStr = addBreakfastStr(res);
    
                $('.main').find('.breakfast-msg-box')
                          .show()
                          .html(htmlStr);
            }
        }
    })
}

module.exports = addBreakfast;

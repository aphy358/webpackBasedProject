const addNetworkStr = require('../templates/addNetwork.ejs');

//获取加宽带的参数
const getParamsForExtraService = require('./sendRequest.js').getParamsForExtraService;

//将替换好的html结构添加到页面指定位置中
function addNetwork() {

    var params = getParamsForExtraService(3);

    $.post('/order/surchargeRoom.do', params, function (res) {

        if (res.result == "success") {
            const write = $.orderInfo;
            res.startDate = write.content.startDate;
            res.endDate = write.content.endDate;
            res.roomNum = write.content.roomNum;

            var htmlStr = addNetworkStr(res);

            $('.main').find('.network-msg-box')
                      .show()
                      .html(htmlStr);
        }
    })
}

module.exports = addNetwork;

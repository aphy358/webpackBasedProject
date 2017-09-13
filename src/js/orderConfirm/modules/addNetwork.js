const addNetworkStr = require('../templates/addNetwork.ejs');

//获取加宽带的参数
const getParamsForExtraService = require('./sendRequest.js').getParamsForExtraService;

// 引入公共函数
Util = require('../../../common/util');

//将替换好的html结构添加到页面指定位置中
function addNetwork() {

    var params = getParamsForExtraService(3);

    $.post('/order/surchargeRoom.do', params, function (res) {

        if (res.result == "success") {

            res.startDate = Util.queryString('startDate');
            res.endDate = Util.queryString('endDate');
            res.roomNum = Util.queryString('roomNum');

            var htmlStr = addNetworkStr(res);

            $('.main').find('.network-msg-box')
                      .show()
                      .html(htmlStr);
        }
    })
}

module.exports = addNetwork;

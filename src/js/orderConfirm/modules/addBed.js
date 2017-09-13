const addBedStr = require('../templates/addBed.ejs');

const getParamsForExtraService = require('./sendRequest.js').getParamsForExtraService;

// 引入公共函数
Util = require('../../../common/util');

//将替换好的html结构添加到页面指定位置中
function addBed() {

    var params = getParamsForExtraService(2);

    $.post('/order/surchargeRoom.do', params, function (res) {

        if (res.result == "success") {

            res.startDate = Util.queryString('startDate');
            res.endDate = Util.queryString('endDate');
            res.roomNum = Util.queryString('roomNum');
            
            res.ofType = [];
            for (var i = 0; i < res.data[0].length; i++) {
                res.ofType[i] = res.data[0][i].type;
            }

            var htmlStr = addBedStr(res);

            $('.main').find('.bed-msg-box')
                      .show()
                      .html(htmlStr);

            //限制用户加床的总数
            limitBedNum(res);
        }
    })
}

function limitBedNum(res) {
    //先判断用户加床总数是否超过房间数x每间房最多能加的床数
    var addBedTotal = res.roomNum * res.data[0][0].max;

    //把用户能添加的最大床数绑定给添加按钮
    $('.add-bed').attr("addBedTotal", addBedTotal);
}

module.exports = addBed;

//加床、加早、加宽带模块的交互

const getDateEnuArr = require('../../../common/util').getDateEnuArr;

//引入加床、加早、加宽带模块
const addBreakfast = require('./addBreakfast.js');
const addBed = require('./addBed.js');
const addNetwork = require('./addNetwork.js');

//引入入住信息结构
const guestMsg = require('../templates/guestMessage.ejs');

//定义每次操作的id以及总加床数
var count = 0;

//存储用户每天加床的数目
var totalBedNum = {};



//将日期逐一递增的函数
/*
* startify 标准格式的日期
* dayCount 要增加的天数(间接决定循环的次数）
* doEveryLoop 每次循环要执行的函数
* */
function addOneDay(startify, dayCount, doEveryLoop) {
    for (var i = 0; i < dayCount; i++) {
        var startDay = new Date((startify / 1000 + i * 86400) * 1000);

        var year = startDay.getFullYear();
        var month = startDay.getMonth() + 1;
        month = '' + month;
        var date = startDay.getDate();
        date = '' + date;
        if (month.length == 1) {
            month = '0' + month;
        }
        if (date.length == 1) {
            date = '0' + date;
        }
        var everyDate = year + '-' + month + '-' + date;

        doEveryLoop(everyDate);
    }
}


//当进行加床、加早、加宽带时，先为新增项获取相关参数，比如日期、每一天的价格、增加的数量等
function getParamsForAddItem(_this) {
    var itemMsg = {},
        parent = _this.parent();

    //判断用户点击的是加床还是加早餐
    itemMsg.addCategory = _this.attr('add-category');

    //获取用户输入或选择的信息
    itemMsg.startDate = parent.find('.start-date').val();
    itemMsg.endDate = parent.find('.end-date').val();
    itemMsg.dayArr = getDateEnuArr(itemMsg.startDate, itemMsg.endDate);

    itemMsg.addType = parent.find('.add-type').val();
    itemMsg.addNum = parent.find('.add-num').val() || '1';

    itemMsg.data = _this.attr('data-str') ?
        JSON.parse(decodeURI(_this.attr('data-str'))) :
        null;

    itemMsg.$this = _this;

    return itemMsg;
}


//用户展开加早或加床等列表后，点击“+”在其下方出现增加的条目信息
function addItem() {
    $(document).delegate('.add-msg-option .add-item', 'click', function () {

        //先获取相关参数
        var itemMsg = getParamsForAddItem($(this));

        addItemBot(itemMsg);
    })
}


//为新增项获取单价
function getAddSinglePriceForAddItem(itemMsg) {

    var tmpData = [],
        type = itemMsg.addType,
        dayArr = itemMsg.dayArr,
        totalSinglePrice = 0;

    //二维数组转一维数组
    for (var i = 0; i < itemMsg.data.length; i++) {
        tmpData = tmpData.concat( itemMsg.data[i] );
    }

    var filterData = 
        $.grep(tmpData, function (o, i) { 
            return o.type === type && $.inArray(o.date.substring(0, 10), dayArr) !== -1;
        });

    for (i = 0; i < tmpArr.length; i++) {
        totalSinglePrice += (+tmpArr[i].price);
    }

    return totalSinglePrice;
}



/*
* 用户展开加早或加床等列表后，点击“+”在其下方出现增加的条目信息
* itemMsg.addCategory 区分 加床、加早、加宽带
* itemMsg.startDate 用户所加商品的开始日期
* itemMsg.endDate 用户所加商品的结束日期
* itemMsg.dayArr 存储着入住日期和离店日期之间所有日期的字符串数组
* itemMsg.addType 用户所加商品的类型
* itemMsg.addNum 用户所加商品的数目
* itemMsg.data 存储着后台返回的整个数据
* itemMsg.$this 触发当前事件的元素
*/
function addItemBot(itemMsg) {

    //为新增项获取单价
    itemMsg.addSinglePrice = getAddSinglePriceForAddItem(itemMsg);

    //用一个数记录超过做大加床数的天数，如果这个天数大于0 ，则不添加任何元素到下面和右边
    var overMaxBed = 0;

    //用一个数组记录每一个超过最大加床数的日期
    var overMaxBedArr = [];

    //判断用户此次操作是否为加床
    if (itemMsg.addCategory == 'add-bed') {
        //如果是
        //先将加床数统计到totalBedNum中
        addOneDay(itemMsg.startify, itemMsg.dayCount, function (everyDay) {
            totalBedNum[everyDay] += Number(itemMsg.addNum);

            //判断加床数是否超过当日最大加床数
            if (totalBedNum[everyDay] > itemMsg.addBedTotal) {
                overMaxBed++;
                overMaxBedArr[overMaxBedArr.length] = everyDay;
            }
        });

        //只要有其中一个日期超过，则全部减回，并弹出提示框
        if (overMaxBed > 0) {
            addOneDay(itemMsg.startify, itemMsg.dayCount, function (everyDay) {
                totalBedNum[everyDay] -= Number(itemMsg.addNum);
            });

            //超过能添加的最大床数时，提示用户
            $('.prompt-content').text(overMaxBedArr[0] + '已达最大加床数');
            $('.info-prompt').show();
            $('.info-prompt-box').dialog();
            $('.info-prompt-box').dialog('open');

            //用户点击确定后，隐藏提示信息
            $('.max-bed-num-confirm button,.close-confirm').click(function () {
                $('.info-prompt').hide();
                $('.info-prompt-box').dialog('close');
            });
        }

        //所有日期的加床数均未超过最大加床数时，则正常添加
        if (overMaxBed <= 0) {
            optionAddBot(itemMsg);
        }
    } else {
        //如果不是，则直接添加
        optionAddBot(itemMsg);
    }
}

//单独抽离出一个函数用于向下方添加结构的操作
function optionAddBot(itemMsg) {
    count++;
    //引入用于添加到选项下面的结构
    var finalStr = require('../templates/extraServiceBotItem.ejs');

    itemMsg.count = count;
    //将数据替换到模板中
    finalStr = finalStr(itemMsg);

    var addId,
        $finalStr = $(finalStr);

    //给用户删除单条加床、加早信息的元素绑定事件
    //用户点击删除按钮时，删除当前条
    $finalStr.on('click', '.del-msg-item', function () {
        $(this).parent().parent().detach();

        //更新右边的条数
        addId = $(this).attr('add-id');

        //确定要删的内容属于加床、加早还是加宽带
        itemMsg.addCategory = $(this).attr('add-category');
        //确定删除的起始日期及天数
        itemMsg.delSatrtDate = $(this).attr('add-start');
        itemMsg.delDayCount = $(this).attr('add-count');
        //确定删除的份数
        itemMsg.delNum = $(this).attr('add-num');

        delAddItem(addId, itemMsg);
    });

    itemMsg.$this.parent().parent().append($finalStr);

    itemMsg.addId = count;

    addItemRight(itemMsg);
}

//用户展开加早或加床等列表后，点击“+”在右方"您的选择"中出现增加的条目信息
function addItemRight(itemMsg) {
    //用于添加到页面右边合集部分的结构
    var hotelStr = "";

    addOneDay(itemMsg.startify, itemMsg.dayCount, function (everyDate) {

        //加载增加单条加床、加早时右边添加的结构
        var rightStr = require('../templates/extraServiceRightItem.ejs');

        itemMsg.startDate = everyDate;

        //将数据替换进模板
        hotelStr += rightStr(itemMsg);
    });


    var $hotelStr = $(hotelStr);
    //将结构添加到右边对应的项目下
    $('.hotel-msg-mid ul').show()
        .find('li[add-category="' + itemMsg.addCategory + '"]')
        .show()
        .find('div[add-category="' + itemMsg.addCategory + '"]')
        .append($hotelStr);

    //更新用户所需支付的总费用
    updateTotal();
}

//删除对应加床或加早信息
function delAddItem(addId, itemMsg) {
    //判断用户删除的是否为加床信息
    if (itemMsg.addCategory == 'add-bed') {
        //如果是
        //更新总加床数
        var delStartDate = new Date(itemMsg.delSatrtDate);
        addOneDay(delStartDate, itemMsg.delDayCount, function (everyDay) {
            totalBedNum[everyDay] -= itemMsg.delNum;
        });
    }

    $('*[add-id="' + addId + '"]').remove();

    if ($('.hotel-msg-mid ul li').find('div[add-category="' + itemMsg.addCategory + '"]').children('.hotel-item').length == 0) {

        $('.hotel-msg-mid ul').find('li[add-category="' + itemMsg.addCategory + '"]')
            .hide();

        if ($('.hotel-item').length == 0) {
            $('.hotel-msg-mid ul').hide();
        }
    }
    //更新用户需要支付的总价格
    updateTotal();
}

//更新用户需要支付的总价格
function updateTotal() {
    //更新用户需要支付的总价格
    var roomCost = Number($('#roomCost').text());

    var extraPay = 0;
    for (var i = 0; i < $('.line-total').length; i++) {
        extraPay += Number($('.line-total').eq(i).html());
    }

    var totalPay = roomCost + extraPay;

    //更新用户所需支付的总费用
    $('#extraCost').text(extraPay);
    $('#totalPay').text(totalPay);
}

//用户点击+房间或-房间时，更改对应可增加的床数
function changeRoomNum(write) {
    if (write.content.isChangeNum == true) {
        $('.reduce').click(function () {
            //发送请求

            //更改房间数
            var roomNum = Number($('#room-num').val());
            roomNum--;
            if (roomNum < 1) {
                return;
            }
            $('#room-num').val(roomNum);

            //更改房费和总金额
            $('#roomCost').text(roomNum * write.content.payTotalMoney);

            reloadAddItem(write);
        });

        $('.increase').click(function () {
            //更改房间数
            var roomNum = Number($('#room-num').val());
            roomNum++;
            if (roomNum > write.content.stock) {
                return;
            }
            $('#room-num').val(roomNum);

            //更改房费和总金额
            $('#roomCost').text(roomNum * write.content.payTotalMoney);

            reloadAddItem();

        });
    }
}

//用户改变房间数时，需要清除及重新加载对应的加床加早加宽带信息
function reloadAddItem(write) {
    //先清除上一个加床、加早、加宽带和住客信息
    $('.bed-msg-box').empty();
    $('.breakfast-msg-box').empty();
    $('.network-msg-box').empty();
    $('.guest-msg-box').empty();

    //重新加载这几个模块
    addBed.run();
    addBreakfast.run();
    addNetwork.run();
    //再将入住信息替换好并添加进页面中
    var guestMsgStr = guestMsg(write);
    $('.guest-msg-box').append(guestMsgStr);

    //清除右边的所有加床、加早、加宽带信息
    $('.hotel-msg-mid ul li .hotel-item-box').empty()
        .parent().hide()
        .parent().hide();

    //更新总加床数
    addOneDay(addBedStart, write.content.dateNum, function (everyDay) {
        totalBedNum[everyDay] = 0;
    });

    //更新需要付款的总额
    updateTotal();

    //重新给其绑定事件
    // openAddMsg();

    addItem();
}

module.exports = {
    run: function (write) {
        //存储用户每天加床的数目
        var addBedStart = new Date(write.content.startDate);
        addOneDay(addBedStart, write.content.dateNum, function (everyDay) {
            totalBedNum[everyDay] = 0;
        });

        //用户展开加早或加床等列表后，点击“+”在其下方出现增加的条目信息
        addItem();

        //用户点击+房间或-房间时，更改对应可增加的床数
        changeRoomNum(write);
    }
};

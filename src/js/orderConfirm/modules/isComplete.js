//加载确认订单信息的模板
const confirmOrderMsg = require('../templates/confirmOrderMsg.ejs');

//用户点击支付时，检查信息是否填写完整
function isComplete() {
    //因为其他地方都是预先填好的，用户只能改不能删，所以只需要验证入住信息与验证方式非在线验证时信息是否为空
    $('#nextToPay').click(function () {
        //******** 提交表单之前进行验证
        if (!$("#orderForm").myValid()) {
            //将页面回滚到第一个验证不通过的地方
            //获取第一个验证不通过的元素的位置
            var failedTest = $('.error')[0].offsetTop - 80;

            $('body, html').animate({
                scrollTop: failedTest + "px"
            }, 200);

            return;
        } else {
            //验证通过则将页面中信息取出，替换到确认信息框中
            alertConfirmMsg();
        }
    }
    )
}

function alertConfirmMsg() {
    //取得form表单的数据
    var formData = $('form').serialize();
    //处理该数据
    var formify = formData.split('&');
    var formObj = {};
    for (var i = 0; i < formify.length; i++) {
        var formSingle = formify[i].split('=');
        formObj[formSingle[0]] = formSingle[1];
    }
    //hotelPrice相关
    formObj['roomName'] = formObj['hotelPrice.roomName'];
    formObj['breakFastName'] = formObj['hotelPrice.breakFastName'];
    formObj['cancellationDesc'] = formObj['hotelPrice.cancellationDesc'];
    //将加床、加早、加宽带信息加入到formObj中
    formObj['breakfastNum'] = 0;
    formObj['bedNum'] = 0;
    formObj['networkNum'] = 0;
    var addBreakFastMsg = $('.hotel-breakfast-box .hotel-item .hotel-item-left');
    var addBreakFastNum = $('.hotel-breakfast-box .hotel-item .hotel-item-left .hotel-add-num');
    for (var breakfast = 0; breakfast < addBreakFastNum.length; breakfast++) {
        formObj['breakfastNum'] += +($(addBreakFastNum[breakfast]).text());
    }

    var addBedMsg = $('.hotel-bed-box .hotel-item .hotel-item-left');
    var addBedNum = $('.hotel-bed-box .hotel-item .hotel-item-left .hotel-add-num');
    for (var bed = 0; bed < addBedNum.length; bed++) {
        formObj['bedNum'] += +($(addBedNum[bed]).text());
    }

    var addNetworkMsg = $('.hotel-network-box .hotel-item .hotel-item-left');
    var addNetworkNum = $('.hotel-network-box .hotel-item .hotel-item-left .hotel-add-num');
    for (var network = 0; network < addNetworkNum.length; network++) {
        formObj['networkNum'] += +($(addNetworkNum[network]).text());
    }

    formObj['addBreakfastMsg'] = addBreakFastMsg.eq(0).text();
    formObj['addBedMsg'] = addBedMsg.eq(0).text();
    formObj['addNetworkMsg'] = addNetworkMsg.eq(0).text();
    for (var j = 1; j < addBreakFastMsg.length; j++) {
        formObj['addBreakfastMsg'] += ';' + addBreakFastMsg.eq(j).text();
    }
    for (var y = 1; y < addBedMsg.length; y++) {
        formObj['addBedMsg'] += ';' + addBedMsg.eq(y).text();
    }
    for (var z = 1; z < addNetworkMsg.length; z++) {
        formObj['addNetworkMsg'] += ';' + addNetworkMsg.eq(z).text();
    }

    //个性化要求信息
    formObj['specialReq'] = $("input[name='specialReq']:checked").serialize();

    //用户预付款
    formObj['willUsedBalance'] = $('#usePerPayment').val() || 0;

    //用户支付总价
    formObj['payTotalMoney'] = +$('#totalPay').text();

    formObj['paymentTermName'] = ["客人前台现付", '单结', '周结', '半月结', '月结', '不固定', '三日结', '十日结', '额度结'];

    //入住人信息
    var guestArr = [];
    var guestCollect = $('.guest');
    for (var i = 0; i < guestCollect.length; i++) {
        var surnameCollect = $(guestCollect[i]).find('.first-name');
        var afternameCollect = $(guestCollect[i]).find('.last-name');
        var nationalCollect = $(guestCollect[i]).find('.nationality-msg');
        if (surnameCollect.val().replace(/^\s+|\s+$/g, '')) {
            guestArr[guestArr.length] = {};
            if (nationalCollect) {
                //此时数组的长度已经发生变化，所以下面赋值时需-1
                guestArr[guestArr.length - 1].national = $.trim($(nationalCollect).val());
            }
            //此时数组的长度已经发生变化，所以下面赋值时需-1
            guestArr[guestArr.length - 1].surname = $.trim($(surnameCollect).val());
            guestArr[guestArr.length - 1].aftername = $.trim($(afternameCollect).val());
        }
    }

    formObj['guestArr'] = $(guestArr);
  
    console.log(formObj);
    //将获取的数据嵌入弹出的确认订单信息框中
    var $confirmOrderMsgStr = $(confirmOrderMsg(formObj));

    //用户点击确认之后，隐藏确认订单信息框
    $confirmOrderMsgStr.on('click', '.confirm-order', function () {
        sendData(formObj);
    });
    //用户点击取消之后，隐藏确认订单信息框
    $confirmOrderMsgStr.on('click', '.cancel-order', function () {
        $('.confirm-order-msg-box').remove();
        $('.confirm-order-msg').remove();
    });

    $('.main').append($confirmOrderMsgStr);
    return false;
}

//用户确认订单信息后，验价并发送数据
function sendData(formObj) {
    $('.confirm-order-msg-box').remove();
    $('.confirm-order-msg').remove();

    //进行验价
    //获取参数
    var params = $('form').serialize();
    //处理该数据
    var paramify = params.split('&');
    var paramObj = {};
    for (var i = 0; i < paramify.length; i++) {
        var paramSingle = paramify[i].split('=');
        paramObj[paramSingle[0]] = paramSingle[1];
    }

    //加床加早加宽带
    paramObj['surchargeBref'] = [];
    paramObj['surchargeBed'] = [];
    paramObj['surchargeInternet'] = [];
    var breakfastItem = $('.hotel-breakfast-box .hotel-item');
    var bedItem = $('.hotel-bed-box .hotel-item');
    var networkItem = $('.hotel-network-box .hotel-item');
    //将其中内容取出并放入对应属性中
    paramObj['surchargeBref'] = extraMsg(breakfastItem, paramObj['surchargeBref']);
    paramObj['surchargeBed'] = extraMsg(bedItem, paramObj['surchargeBed']);
    paramObj['surchargeInternet'] = extraMsg(networkItem, paramObj['surchargeInternet']);

    //获取入住人
    paramObj['userNames'] = "";
    $.each(formObj['guestArr'], function (index, value) {
        paramObj['surname'] = $.trim(value.surname);
        paramObj['userName'] = $.trim(value.aftername);
        if (value.national) {
            paramObj['countryId'] = $.trim(value.national);
            paramObj['userNames'] += paramObj['surname'] + '#' + paramObj['userName'] + '#' + paramObj['countryId'] + ',';
        } else {
            paramObj['userNames'] += paramObj['surname'] + '#' + paramObj['userName'] + ',';
        }
    });
    paramObj['userNames'] = paramObj['userNames'].replace(/,$/, '');

    //用户预付款
    paramObj['willUsedBalance'] = formObj['willUsedBalance'];

    //特殊要求
    paramObj['specialRequire'] = decodeURIComponent(formObj['specialReq'], true).split('specialReq=').join('').split('&').join(',');

    //hotelPriceStrs
    paramObj['hotelPriceStrs'] = sessionStorage.getItem("hotelPriceStrs");

    //确认方式
    paramObj['checkType'] = $('input[name=checkType]:checked').attr('checkType');

    //单结或者其他结算方式
    paramObj['paymentTerm'] = formObj['paymentTermSon'];

    params = '';
    for (var k in paramObj) {
        params += k + '=' + paramObj[k] + "&";
    }
    //发送请求
    createOrder(params, formObj);
}

//创建订单
function createOrder(params, formObj) {
    const checkThePrice = require('./sendRequest.js').checkThePrice;
    checkThePrice(params, function (data) {
        if (data.result == 'success') {
            //创建订单
            const saveOrder = require('./sendRequest.js').saveOrder;
            saveOrder(params, function (data) {
                //如果下单成功
                if (data.result == "success") {
                    //发送统计数据
                    charts();
                    var toPay = false;
                    if (data.paymentTerm == 0) {
                        var balance = formObj['willUsedBalance'];
                        var totalMoney = formObj['payTotalMoney'];
                        if (balance == totalMoney) {
                            toPay = false;
                        } else {
                            toPay = true;
                        }
                    }
                    if (toPay) {//去支付页面 支付宝
                        // alert('去支付宝页面');
                        //先判断国内还是国外
                        if (formObj['country'] == 70007) {
                            location.href = "/internalOrder/pay.do?orderId=" + data.orderId;
                        } else {
                            location.href = "/order/orderPay.do?orderId=" + data.orderId;
                        }
                    } else {
                        // alert('订单提交成功');
                        location.href = "/internalOrder/orderSucc.do?orderId=" + data.orderId + "&subOrderCode=" + data.subOrderCode;
                    }
                }
            })

        } else {
            alert(data.returnMsg);
        }
    })
}

function extraMsg(aimDom, resKey) {
    for (var o = 0; o < aimDom.length; o++) {
        resKey[o] = {};
        var obj = resKey[o];
        obj['date'] = $(aimDom[o]).attr('date');
        obj['count'] = $(aimDom[o]).attr('count');
        obj['type'] = $(aimDom[o]).attr('type');
        obj['name'] = $(aimDom[o]).attr('name');
    }
    return window.JSON.stringify(resKey);
}

//发送统计数据
function charts() {
    var hotelName = $("#hotelName").text();
    var distrbCode = $("#consumer").data("distrb");
    $.get("/count/record.do?" + "t=EffectiveOrder&d=" + distrbCode + "|" + hotelName);
}

module.exports = isComplete;

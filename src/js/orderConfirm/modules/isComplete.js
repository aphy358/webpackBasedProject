//加载确认订单信息的模板
const confirmOrderMsg = require('../templates/confirmOrderMsg.ejs');

//用户点击支付时，检查信息是否填写完整
function isComplete() {
  //因为其他地方都是预先填好的，用户只能改不能删，所以只需要验证入住信息与验证方式非在线验证时信息是否为空
  $('.payment-confirm button').click(function () {
    //******** 提交表单之前进行验证
    if (!$("#orderForm").myValid()){
      //将页面回滚到第一个验证不通过的地方
      //获取第一个验证不通过的元素的位置
      var failedTest=$('.error')[0].offsetTop-80;
      
      $('body, html').animate({
        scrollTop:failedTest+"px"
      },200);
      
      return;
    }else{
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
      var addBreakFastNum = $('.hotel-breakfast-box .hotel-item .hotel-item-left .add-num');
      for (var breakfast = 0; breakfast < addBreakFastNum.length; breakfast++) {
        formObj['breakfastNum'] += +($(addBreakFastNum[breakfast]).text());
      }
      
      var addBedMsg = $('.hotel-bed-box .hotel-item .hotel-item-left');
      var addBedNum = $('.hotel-bed-box .hotel-item .hotel-item-left .add-num');
      for (var bed = 0; bed < addBedNum.length; bed++) {
        formObj['bedNum'] += +($(addBedNum[bed]).text());
      }
      
      var addNetworkMsg = $('.hotel-network-box .hotel-item .hotel-item-left');
      var addNetworkNum = $('.hotel-network-box .hotel-item .hotel-item-left .add-num');
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
      
      //用户支付总价
      formObj['payTotalMoney'] = +$('#totalPay').text();
      
      formObj['paymentTermName'] = ["客人前台现付", '单结', '周结', '半月结', '月结','不固定', '三日结', '十日结','额度结'];
      
      //入住人信息
      var guestArr = [];
      var guestCollect = $('.guest');
      for (var i = 0; i < guestCollect.length; i++) {
        var surnameCollect = $(guestCollect[i]).find('.first-name');
        var afternameCollect = $(guestCollect[i]).find('.last-name');
        if($(guestCollect[i]).find('.nationality-msg')){
          //国外
          var nationalCollect= $(guestCollect[i]).find('.nationality-msg');
          if( surnameCollect.val().replace(/^\s+|\s+$/g, '')){
            guestArr[guestArr.length] = {};
            //此时数组的长度已经发生变化，所以下面赋值时需-1
            guestArr[guestArr.length-1].surname = $(surnameCollect).val();
            guestArr[guestArr.length-1].aftername = $(afternameCollect).val();
            guestArr[guestArr.length-1].national = $(nationalCollect).val();
          }
        }else{
          //国内
          if( surnameCollect.val().replace(/^\s+|\s+$/g, '')){
            guestArr[guestArr.length] = {};
            guestArr[guestArr.length-1].surname = $(surnameCollect).val();
            guestArr[guestArr.length-1].aftername = $(afternameCollect).val();
          }
        }
      }
      
      formObj['guestArr'] = $(guestArr);
      //将获取的数据嵌入弹出的确认订单信息框中
      var $confirmOrderMsgStr = $(confirmOrderMsg(formObj));
      
      //用户点击确认之后，隐藏确认订单信息框
      $confirmOrderMsgStr.on('click','.confirm-order',function () {
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
        
        //获取入住人
        paramObj['userNames'] = '';
        $.each(formObj['guestArr'],function(index,value){
          paramObj['surname'] = value.surname;
          paramObj['userName'] = value.aftername;
          if(value.national){
            paramObj['userNames'] += value.surname + '#' + value.aftername + '#' + value.national + ',';
            paramObj['countryId'] = value.national;
          }else{
            paramObj['userNames'] += value.surname + '#' + value.aftername + '#,';
          }
        });
        
        //特殊要求
        paramObj['specialRequire'] = decodeURIComponent(formObj['specialReq'],true).split('specialReq=').join('').split('&').join(',');
        
        //hotelPriceStrs
        paramObj['hotelPriceStrs'] = sessionStorage.getItem("hotelPriceStrs");
        
        //确认方式
        if(decodeURIComponent(paramObj['checkType']) == '在线确认'){
          paramObj['checkType'] = 9;
        }
        
        params = '';
        for (var k in paramObj) {
          params += k + '=' + paramObj[k] + "&";
        }
        //发送请求
        const checkThePrice = require('./sendRequest.js').checkThePrice;
        checkThePrice(params,function (data) {
          if(data.result == 'success'){
            //创建订单
            const saveOrder = require('./sendRequest.js').saveOrder;
            saveOrder(params,function (data) {
              //如果下单成功
              if(data.result=="success"){
                //发送统计数据
                charts();
                var toPay = false;
                if(data.paymentTerm == 0){
                  var balance = formObj['willUsedBalance'];
                  var totalMoney = formObj['payTotalMoney'];
                  if(balance == totalMoney){
                    toPay = false;
                  }else{
                    toPay = true;
                  }
                }
                if(toPay){//去支付页面 支付宝
                  alert('去支付宝页面');
                  // location.href= "/internalOrder/orderPay.do?orderId="+data.orderId;
                }else{
                  alert('订单提交成功');
                  // location.href= "/internalOrder/orderSucc.do?orderId="+data.orderId+"&subOrderCode=" + data.subOrderCode;
                }
              }else{
                // hand.info(data.message);
                alert(data.message);
              }
            })
          }
        })
      });
      //用户点击取消之后，隐藏确认订单信息框
      $confirmOrderMsgStr.on('click','.cancel-order',function () {
        $('.confirm-order-msg-box').remove();
        $('.confirm-order-msg').remove();
      });
      
      $('.main').append($confirmOrderMsgStr);
      return false;
    }
    
    //跳转到确认支付页面
  })
}

//发送统计数据
function charts(){
  var hotelName = $("#hotelName").text();
  var distrbCode = $("#consumer").data("distrb");
  $.get("/count/record.do?" + "t=EffectiveOrder&d="+distrbCode+"|"+hotelName);
}

module.exports = isComplete;

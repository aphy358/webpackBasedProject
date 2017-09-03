//引入加床、加早、加宽带模块
const addBreakfast = require('./addBreakfast.js');
const addBed = require('./addBed.js');
const addNetwork = require('./addNetwork.js');

//引入入住信息结构
const guestMsg = require('../templates/guestMessage.ejs');

//定义每次操作的id以及总加床数
var count = 0;
//存储用户每天加床、加宽带的数目
var totalBedNum = {};
var totalNetNum = 0;

//将日期以yyyy-mm-hh格式逐一递增的函数
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

//用户展开加早或加床等列表后，点击“+”在其下方出现增加的条目信息
function addItem() {
  $(document).delegate('.add-msg-option .add-item', 'click', function () {
    //先清除上一次的数据
    var itemMsg = {};
    
    //判断用户点击的是加床还是加早餐
    itemMsg.addCategory = $(this).attr('add-category');
  
    itemMsg.addNum = $(this).siblings().children('.add-num').val();
  
    //如果添加类型为加早，先验证用户输入的是否为整数及大于0的数
    if(itemMsg.addCategory == 'add-breakfast'){
      var isInt = /^[0-9]*[1-9][0-9]*$/;
      if( !(+itemMsg.addNum > 0) || !isInt.test(itemMsg.addNum) ){
        $(this).siblings().children('.breakfast-num').val('');
        layer.alert('加早数量必须为正整数');
        return;
      }
    }
    
    //获取用户输入或选择的信息
    itemMsg.startDate = $(this).siblings().children('.start-date').val();
    itemMsg.endDate = $(this).siblings().children('.end-date').val();
    
    itemMsg.startify = new Date(itemMsg.startDate);
    itemMsg.endify = new Date(itemMsg.endDate);
    
    var millisecond = itemMsg.endify - itemMsg.startify;//天数*24*60*60*1000=millisecond
    itemMsg.dayCount = millisecond / 86400000;
    
    itemMsg.addType = $(this).attr('add-type') || $(this).siblings().children('select').val();
    
    //先获取用户选择的加早、加床、加宽带信息
    var priceMsg = $(this).attr('data-str');
    //将信息解码
    priceMsg = decodeURI(priceMsg, true);
    priceMsg = JSON.parse(priceMsg);
    itemMsg.addPrice = {};
    //遍历信息并与获取的信息作比对，得到价格
    addOneDay(itemMsg.startify, itemMsg.dayCount, function (everyDay) {
      for (var i = 0; i < priceMsg.length; i++) {
        for (var j = 0; j < priceMsg[i].length; j++) {
          if (priceMsg[i][j].date.split(' ')[0] == everyDay && priceMsg[i][j].name == itemMsg.addType) {
            itemMsg.addPrice[everyDay] = Number(priceMsg[i][j].price);
          }else if(priceMsg[i][j].date.split(' ')[0] == everyDay && itemMsg.addType == '宽带'){
            itemMsg.addPrice[everyDay] = Number(priceMsg[i][j].price);
          }
        }
      }
    });
    itemMsg.totalPrice = 0;
    for (var k in itemMsg.addPrice) {
      itemMsg.totalPrice += itemMsg.addPrice[k];
    }
    itemMsg.singleTotal = itemMsg.addNum * itemMsg.totalPrice;
    
    itemMsg.$this = $(this);
    
    itemMsg.addBedTotal = itemMsg.$this.attr('addBedTotal');
    
    addItemBot(itemMsg);
  })
}

//用户展开加早或加床等列表后，点击“+”在其下方出现增加的条目信息
/*
* itemMsg.startDate 用户所加商品的开始日期
* itemMsg.endDate 用户所加商品的结束日期
* itemMsg.addType 用户所加商品的类型
* itemMsg.addNum 用户所加商品的数目
* itemMsg.dayCount 用户所加商品的天数
* itemMsg.singleTotal 添加操作下单条增添信息的总价
* itemMsg.addId 每次增添附带的id，作为每次增添操作的唯一标识符
* itemMsg.$this 触发当前事件的元素
* itemMsg.addPrice 每次增添操作的商品的单价
* itemMsg.startify 用户所加商品的开始日期的标准格式
* itemMsg.endify 用户所加商品的结束日期的标准格式
*/
function addItemBot(itemMsg) {
//用一个数记录超过做大加床数的天数，如果这个天数大于0 ，则不添加任何元素到下面和右边
  var overMaxBed = 0;
//用一个数组记录每一个超过最大加床数的日期
  var overMaxBedArr = [];
  
  //判断用户此次操作是否为加床
  if (itemMsg.addCategory == 'add-bed') {
    //如果是,先将加床数统计到totalBedNum中
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
      layer.alert(overMaxBedArr[0] + '已达最大加床数');
    }
  
    //所有日期的加床数均未超过最大加床数时，则正常添加
    if (overMaxBed <= 0) {
      optionAddBot(itemMsg);
    }
  }else if(itemMsg.addCategory == 'add-network'){
    addOneDay(itemMsg.startify, itemMsg.dayCount,function (everyDay) {
      totalNetNum += +itemMsg.addNum;
    });
    //判断加宽带数是否超过最大加宽带数
    if(totalNetNum > itemMsg.dayCount * +$('#room-num').val()){
      //超过能添加的最大床数时，提示用户
      layer.alert(itemMsg.startDate + '最多加' + itemMsg.dayCount * +$('#room-num').val() + '间房的宽带数');
      //将已添加的宽带数还原
      totalNetNum -= +itemMsg.addNum;
      return;
    }else{
      //如果没超过则正常添加
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
    itemMsg.delNum = +$(this).attr('add-num');
    
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
    
    itemMsg.everyDate = everyDate;
    
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
  }else if(itemMsg.addCategory == 'add-network'){
    //如果为加宽带信息，更新加宽带总数
    totalNetNum -= itemMsg.delNum;
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

//用户在护照国籍框输入内容时，展示搜索结果
function openSearchNationalResult() {
  $('.main').on('keyup','.nationality-msg',function (e) {
    //取得用户输入的值并作为key发送请求
    var inputMsg = $(this).val();
    
    //当用户输入的内容为空时，隐藏结果显示框
    if(!inputMsg){
      $(e.target).siblings('.search-result').empty().hide();
      return;
    }
    const getNationalMsg = require('./sendRequest.js').getNationalMsg;
    //发送请求
    getNationalMsg(inputMsg,function (data) {
      var countries = "";
      for (var i = 0; i < data.list.length && i < 10; i++) {
        countries += '<li class="national-single-result" ' +
          'data-cid="'+ data.list[i].countryid +'">'+
          data.list[i].name.split("-")[1] +'</li>';
      }
      //当用户选择相应国家时，将其内容放入输入框中
      $('.main').on('click','.national-single-result',function (e) {
        //将国家的id也赋值给input标签
        var countryId = $(e.target).attr('data-cid');
        $(e.target).closest('.nation-box').find('input').attr('data-cid',countryId)
          .val(e.target.textContent);
        //将下拉列表隐藏
        $(e.target).parent().empty().hide();
      });
      $(e.target).siblings('.search-result').html(countries).show();
    });
  });
  //点击下拉列表以外的区域隐藏下拉列表
  $(document).bind('click',function () {
    $('.search-result').empty().hide();
  });
  $('.search-result li').on('click',function (e) {
    e.stopPropagation();
  })
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
      resendRequest(false,write);
    });
    
    $('.increase').click(function () {
      //发送请求
      resendRequest(true,write);
    });
  }
}

function resendRequest(isIncrease,write) {
  //引入用于确认酒店是否下线的请求的函数和引入用于获取页面主要数据的请求函数
  const getCheck = require('./sendRequest.js').getCheck;
  const getWrite = require('./sendRequest.js').getWrite;
  
  getCheck(function (checkData) {
    if (checkData.isOnline) {
      //请求页面中用于显示信息的数据
      var roomNum = Number($('#room-num').val());
      if(isIncrease){
        roomNum++;
        if (roomNum > write.content.stock || roomNum > write.content.hotelPrice.maxPersonNum) {
          return;
        }
      }else{
        roomNum--;
        if (roomNum < 1) {
          return;
        }
      }
      $('#room-num').val(roomNum);
      
      getWrite(function (writeData) {
        if (writeData.success == true) {
          writeData.content.paymentTermName = ["客人前台现付", '单结', '周结', '半月结', '月结','不固定', '三日结', '十日结','额度结'];
          
          write = writeData;
  
          //更改房费和总金额
          $('#roomCost').text(roomNum * write.content.payTotalMoney);
  
          reloadAddItem(write);
        }
      },roomNum);
    }
  });
}

//用户改变房间数时，需要清除及重新加载对应的加床加早加宽带信息
function reloadAddItem(write) {
  //先清除上一个加床、加早、加宽带和住客信息
  $('.need-reload-box').empty();
  
  //重新加载这几个模块
  addBed.run(write);
  addBreakfast.run(write);
  addNetwork.run(write);
  
  //再将入住信息替换好并添加进页面中
  var guestMsgStr = guestMsg(write);
  $('.guest-msg-box').empty().append(guestMsgStr);
  
  //清除右边的所有加床、加早、加宽带信息
  $('.hotel-msg-mid ul li .hotel-item-box').empty()
    .parent().hide()
    .parent().hide();
  
  //更新总加床数
  //存储用户每天加床的数目
  var addBedStart = new Date(write.content.startDate);
  addOneDay(addBedStart, write.content.dateNum, function (everyDay) {
    totalBedNum[everyDay] = 0;
  });
  
  //更新需要付款的总额
  updateTotal();
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
  
    //用户在护照国籍框输入内容时，展示搜索结果
    openSearchNationalResult();
  }
};

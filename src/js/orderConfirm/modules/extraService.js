//加床、加早、加宽带模块的交互
//请求静态数据
const write = require('../testData/write.do.js');

//引入加床、加早、加宽带模块
const addBreakfast = require('./addBreakfast.js');
const addBed = require('./addBed.js');
const addNetwork = require('./addNetwork.js');


//引入入住信息结构
const guestMsg = require('../templates/guestMessage.ejs');

//定义每次操作的id以及总加床数
var count = 0,
totalAddNum = 0;

//用户点击加早或加床等的“+”号时展开操作列表
function openAddMsg() {
	$('.open-detail-msg').on('click', function () {
		$(this).parent().parent().hide()
		.siblings('.open-add-msg').show();
	})
}

//用户展开加早或加床等列表后，点击“+”在其下方出现增加的条目信息
function addItem() {
    //先清除上一次的数据
    var itemMsg = {};
  
    $('.add-msg-option').delegate('.add-item', 'click', function () {

	    //判断用户点击的是加床还是加早餐
	    itemMsg.addCategory = $(this).attr('add-category');
	    
	    //获取用户输入或选择的信息
	    itemMsg.startDate = $(this).siblings().children('.start-date').val();
	    itemMsg.endDate = $(this).siblings().children('.end-date').val();
	    
	    itemMsg.startify = new Date(itemMsg.startDate);
	    itemMsg.endify = new Date(itemMsg.endDate);
	    
	    var millisecond = itemMsg.endify - itemMsg.startify;//天数*24*60*60*1000=millisecond
	    itemMsg.dayCount = millisecond / 86400000;
	    
	    itemMsg.addType = $(this).siblings().children('select').val() || $(this).attr('add-type');
	    
	    itemMsg.addPrice = $(this).siblings().children('select').find('option:selected').attr(itemMsg.addCategory) || $(this).attr(itemMsg.addCategory);
	    
	    itemMsg.addNum = $(this).siblings().children('.bed-num').val() || $(this).siblings().children('.breakfast-num').val() || 1;
	    
	    itemMsg.$this = $(this);
	    
	    if ($(this).attr('add-category') == 'add-bed') {
	        //先判断用户加床总数是否超过房间数x每间房最多能加的床数
	        //获取能添加的最大床数
	        var addBedTotal = itemMsg.$this.attr('addBedTotal');
	        totalAddNum += Number(itemMsg.addNum);
	      
	        if (totalAddNum > addBedTotal) {
		        //超过能添加的最大床数时，提示用户
		        $('.info-prompt').show();
		        $('.info-prompt-box').dialog();
		        $('.info-prompt-box').dialog('open');
		        
		        //用户点击确定后，隐藏提示信息
		        $('.max-bed-num-confirm button,.close-confirm').click(function () {
		            //先更新总加床数
		            totalAddNum = addBedTotal;

		            $('.info-prompt').hide();
		            $('.info-prompt-box').dialog('close');

	            });
	            return;
            }
        }

		itemMsg.singleTotal = itemMsg.addNum * itemMsg.dayCount * itemMsg.addPrice;

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
  
    for (var i = 0; i < itemMsg.dayCount; i++) {
	  	if (itemMsg.endify - itemMsg.startify > 0) {
	  		var startify = new Date((itemMsg.startify / 1000 + i * 86400) * 1000);

	  		var year = startify.getFullYear();
	  		var month = startify.getMonth() + 1;
	  		month = '' + month;
	  		var date = startify.getDate();
	  		date = '' + date;
	  		if (month.length == 1) {
	  			month = '0' + month;
	  		}
	  		if (date.length == 1) {
	  			date = '0' + date;
	  		}
	  		itemMsg.startDate = year + '-' + month + '-' + date;

	        //加载增加单条加床、加早时右边添加的结构
	        var rightStr = require('../templates/extraServiceRightItem.ejs');
	      
	        //将数据替换进模板
	        hotelStr += rightStr(itemMsg);
        }
	}

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
  // debugger;
    //更新总加床数
    totalAddNum -= Number(itemMsg.addNum);
  
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
function changeRoomNum() {
	$('.reduce').click(function () {
	    //发送请求
	    
	    //更改房间数
	    var roomNum = Number($('#room-num').text());
	    roomNum--;
	    if (roomNum < 1) {
	    	return;
	    }
	    $('#room-num').text(roomNum);
	    
	    //更改房费和总金额
	    $('#roomCost').text(roomNum * write.content.payTotalMoney);
	    
	    reloadAddItem();
    });

	$('.increase').click(function () {
	    //更改房间数
	    var roomNum = Number($('#room-num').text());
	    roomNum++;
	    if (roomNum > write.content.stock) {
	    	return;
	    }
	    $('#room-num').text(roomNum);
	    
	    //更改房费和总金额
	    $('#roomCost').text(roomNum * write.content.payTotalMoney);
	    
	    reloadAddItem();
    
	});
}

//用户改变房间数时，需要清除及重新加载对应的加床加早加宽带信息
function reloadAddItem() {
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
    totalAddNum = 0;
  
    //更新需要付款的总额
    updateTotal();
  
    //重新给其绑定事件
    openAddMsg();
  
    addItem();
}

module.exports = {
	run: function () {
	    //用户展开加早或加床等列表后，点击“+”在其下方出现增加的条目信息
	    addItem();
	    
	    //用户点击+房间或-房间时，更改对应可增加的床数
	    changeRoomNum();
	}
};

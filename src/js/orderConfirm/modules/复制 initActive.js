//引入日期控件模块
const selectDate = require('../../../common/selectDate/selectDate.js');


//引入初始化验证模块
const InitValidator = require('./initValidator.js');

//请求静态数据
// const write = require('../testData/write.do.js');

//引入加床、加早、加宽带的交互模块
const extraService = require('./extraService.js');


//引入用户点击支付时，检查信息是否填写完整的模块
const isComplete = require('./isComplete.js');



//用户点击加早或加床等的“+”号时展开操作列表
function openAddMsg() {
	$(document).delegate('.open-detail-msg', 'click', function () {
		$(this).parent().parent().hide()
		.siblings('.open-add-msg').show();
	})
}

//加载日期控件
function addSelectDate() {
	var minDate = $('.main').find('.start-date').text();
	var maxDate = $('.main').find('.end-date').text();

	var breakfastStart = $('.breakfast-start');
	var breakfastEnd = $('.breakfast-end');
	selectDate.run(1, breakfastStart, breakfastEnd, minDate, maxDate);

	var bedStart = $('.bed-start');
	var bedEnd = $('.bed-end');
	selectDate.run(1, bedStart, bedEnd, minDate, maxDate);

	var networkStart = $('.network-start');
	var networkEnd = $('.network-end');
	selectDate.run(1, networkStart, networkEnd, minDate, maxDate);
}

//用户切换确认方式时，自动将用户预留的相关信息显示在对应区域内
function changeConfirmWay(write) {
	$('.other-confirm-way').click(function () {
		var confirmWay = $(this).attr('confirm-way');
		var confirmId = '#' + $(this).attr('confirm-way');

	    //先清空确认方式下所有输入框的内容
	    $('.confirm-way-msg li input').val('').siblings('i').hide();
	    //再显示当前确认方式下的内容
	    $('.confirm-way-msg').find(confirmId).val(write.content.distributor[confirmWay])
	    .siblings('i').show();
	    
	    //更改验证规则
    $("input[name^=voucher]").each(function(i,n){
      $(n).rules("remove", "required");
      
      if( $(n).hasClass("usingPlaceHolder") ){		//***  针对IE浏览器有placeholder的特殊情况进行特殊处理
        n.value = '';
      }
      
      $(n).focus();
      $(n).blur();
    });
    
    //给当前确认方式添加必填验证
    $(confirmId).rules("add",{required:true});
	});
}

//用户选择使用预收款时，数目不能小于0，不能大于需要支付的总金额，不能大于能预支付的总金额
function limitPerPayment(write) {
	$('#use-per-payment').keyup(function () {
	    //判断用户所能预支付的最大款项
	    var totalPayment = Number($('#totalPay').text());
	    var maxPayment = write.content.balance > totalPayment ? totalPayment : write.content.balance;
	    
	    var payMent = $('#use-per-payment').val();
	    
	    if (payMent < 0) {
	    	$('.per-payment-prompt').text('请输入一个大于0的数字');
	    } else if (payMent > maxPayment) {
	    	$('.per-payment-prompt').text('您的余额不足或预付款超出本次消费总金额');
	    } else {
	    	$('.per-payment-prompt').text('');
	    }
    })
}


module.exports = {
	run: function (write) {
		//用户点击加早或加床等的“+”号时展开操作列表
		openAddMsg();
  
		//初始化验证
		InitValidator();
		
		//加载日期控件
		addSelectDate();

		//引入加床、加早、加宽带的交互模块
		extraService.run(write);

		//用户切换确认方式时，自动将用户预留的相关信息显示在对应区域内
		changeConfirmWay(write);
  
		//用户使用预收款时，数目不能小于0，不能大于需要支付的总金额或能预支付的总金额
		limitPerPayment(write);
		
		//用户点击支付时，检查信息是否填写完整
		isComplete();
  }
};

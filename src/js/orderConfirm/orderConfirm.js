// require('./modules/orderMain.js').run();

require('../../static/css/reset.css');
require('../../sass/orderConfirm/orderConfirm.scss');
require('../../sass/header.scss');
require('../../sass/footer.scss');
require('../../static/css/tooltip_m.css');

//引入表单验证插件
// require('../../static/js/tooltip_m.js');
// require('../../static/js/jquery.validate.js');

//引入主模板
const orderMain = require('./templates/orderMain.ejs');

//引入日期控件模块
// const selectDate = require('../../common/selectDate/selectDate.js');

//请求静态数据
const write = require('./testData/write.do.js');

//引入加床、加早、加宽带模块
const addBreakfast = require('./modules/addBreakfast.js');
const addBed = require('./modules/addBed.js');
const addNetwork = require('./modules/addNetwork.js');

//引入用户点击支付时，检查信息是否填写完整的模块
const isComplete = require('./modules/isComplete.js');


var writeStr;

//引入初始化验证模块
const InitValidator = require('./modules/initValidator.js');

//引入加床、加早、加宽带的交互模块
const extraService = require('./modules/extraService.js');

//将替换好的html结构添加到页面中以显示
function add() {
  $('.main').html(writeStr);
  
  //添加加床、加早、加宽带模块
  addBreakfast.run();
  addBed.run();
  addNetwork.run();
}

//将获取到的数据动态加载到页面中
function getData() {
  //确认用户是否在线
  const checkData = require('./testData/check.do.js');
  if (checkData.isOnline == false) {
    alert("请先登录");
  } else {
    write.content.paymentTermName = ["客人前台现付", '单结', '周结', '半月结', '月结', '三日结', '十日结'];
    
    const content = write.content;
    
    if (write.success == true) {
      writeStr = orderMain(content);
      //将替换好的结构添加到页面中
      add();
    }
    
  }
  
}

//用户点击加早或加床等的“+”号时展开操作列表
function openAddMsg() {
  $('.open-detail-msg').on('click', function () {
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
function changeConfirmWay() {
  $('.other-confirm-way').click(function () {
    var confirmWay=$(this).attr('confirm-way');
    var confirmId='#'+$(this).attr('confirm-way');
    
    //先清空确认方式下所有输入框的内容
    $('.confirm-way-msg li input').val('').siblings('i').hide();
    $('.confirm-way-msg').find(confirmId).val(write.content.distributor[confirmWay])
      .siblings('i').show();
    
    //用户离开输入框时即进行验证
    // $('.confirm-way-msg li input').blur(function () {
    // debugger;
    // $("#orderForm").myValid();
    // })
  });
}

//用户选择使用预收款时，数目不能小于0，不能大于需要支付的总金额，不能大于能预支付的总金额
function limitPerPayment() {
  $('#use-per-payment').blur(function () {
    //判断用户所能预支付的最大款项
    var totalPayment = Number($('#totalPay').text());
    var maxPayment = write.content.balance > totalPayment ? totalPayment : write.content.balance;
    
    var payMent=$('#use-per-payment').val();
    
    if(payMent < 0){
      $('.per-payment-prompt').text('请输入一个大于0的数字');
    }else if(payMent > maxPayment){
      $('.per-payment-prompt').text('您的余额不足或预付款超出本次消费总金额');
    }else{
      $('.per-payment-prompt').text('');
    }
    
  })
}


//加载页面时先到后台检查
    getData();


//用户点击加早或加床等的“+”号时展开操作列表
    openAddMsg();
    
    //引入加床、加早、加宽带的交互模块
    extraService.run();


//用户点击支付时，检查信息是否填写完整
    isComplete();

//用户切换确认方式时，自动将用户预留的相关信息显示在对应区域内
    changeConfirmWay();

//初始化验证
    InitValidator();

//用户使用预收款时，数目不能小于0，不能大于需要支付的总金额或能预支付的总金额
    limitPerPayment();


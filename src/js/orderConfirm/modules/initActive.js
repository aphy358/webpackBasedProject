//引入日期控件模块
const selectDate = require('../../../common/selectDate/selectDate.js');

//请求静态数据
var write = $.orderInfo;

//引入加床、加早、加宽带的交互模块
const extraService = require('./extraService.js');

//引入初始化验证模块
const InitValidator = require('./initValidator.js');


//引入用户点击支付时，检查信息是否填写完整的模块
const isComplete = require('./isComplete.js');

//用户点击加早或加床等的“+”号时展开操作列表
function openAddMsg() {
    $(document).delegate('.open-detail-msg', 'click', function () {
        var parent = $(this).closest('.need-reload-box');
        parent.find('.other-msg').hide();
        parent.find('.open-add-msg').show();

        //加载日期控件
        addSelectDate();
    })
}

//加载日期控件
function addSelectDate() {
    var minDate = $('.main').find('.start-date').text();
    var maxDate = $('.main').find('.end-date').text()

    var breakfastStart = $('.main').find('.breakfast-start');
    var breakfastEnd = $('.main').find('.breakfast-end');
    selectDate.run(1, breakfastStart, breakfastEnd, minDate, maxDate);

    var bedStart = $('.main').find('.bed-start');
    var bedEnd = $('.main').find('.bed-end');
    selectDate.run(1, bedStart, bedEnd, minDate, maxDate);

    var networkStart = $('.main').find('.network-start');
    var networkEnd = $('.main').find('.network-end');
    selectDate.run(1, networkStart, networkEnd, minDate, maxDate);
}

//用户切换确认方式时，自动将用户预留的相关信息显示在对应区域内
function changeConfirmWay() {
    $('.other-confirm-way').click(function () {
        var confirmWay = $(this).attr('confirm-way');
        var confirmId = '#' + $(this).attr('confirm-way');

        //先清空确认方式下所有输入框的内容并设为只读
        $('.confirm-way-msg li input').val('').siblings('i').hide();
        //再显示当前确认方式下的内容
        $('.confirm-way-msg').find(confirmId).val(write.content.distributor[confirmWay]).siblings('i').show();

        //更改验证规则
        $("input[name^=voucher]").each(function (i, n) {
            $(n).rules("remove", "required");

            if ($(n).hasClass("usingPlaceHolder")) {		//***  针对IE浏览器有placeholder的特殊情况进行特殊处理
                n.value = '';
            }

            $(n).focus();
            $(n).blur();
        });

        //给当前确认方式添加必填验证
        $(confirmId).rules("add", { required: true });
    });
}

//用户填写了姓或名或护照任何一个时，同一栏的其他信息也必填
function validateTheSame() {
    $('.guest').on('keyup', 'input', function () {
        if ($(this).closest('.guest').find('input').val()) {
            $(this).closest('.guest').find('input').valid();
        } else {
            $(this).closest('.guest').find('input').valid(false);
        }
    })
}

//用户选择使用预收款时，数目不能小于0，不能大于需要支付的总金额，不能大于能预支付的总金额
function limitPerPayment() {
    $('#usePerPayment').keyup(function () {
        //判断用户所能预支付的最大款项
        var totalPayment = Number($('#totalPay').text());
        var maxPayment = write.content.balance > totalPayment ? totalPayment : write.content.balance;

        var payMent = $('#usePerPayment').val();

        if (payMent > maxPayment) {
            $('#usePerPayment').rules('add', { max: maxPayment });
            $('#usePerPayment').valid();
        }
    })
}


module.exports = {
    run: function () {
        //用户点击加早或加床等的“+”号时展开操作列表
        openAddMsg();

        //初始化验证
        InitValidator();

        validateTheSame();

        //引入加床、加早、加宽带的交互模块
        extraService.run();

        //用户切换确认方式时，自动将用户预留的相关信息显示在对应区域内
        changeConfirmWay();

        //用户使用预收款时，数目不能小于0，不能大于需要支付的总金额或能预支付的总金额
        limitPerPayment();

        //用户点击支付时，检查信息是否填写完整
        isComplete();
    }
};

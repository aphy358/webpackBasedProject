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
        //将加床、加早、加宽带信息加入到formObj中
        var addBreakFastMsg = $('.hotel-breakfast-box .hotel-item .hotel-item-left');
        formObj['breakfastNum'] = addBreakFastMsg.length;
        var addBedMsg = $('.hotel-bed-box .hotel-item .hotel-item-left');
        formObj['bedNum'] = addBedMsg.length;
        var addNetworkMsg = $('.hotel-network-box .hotel-item .hotel-item-left');
        formObj['networkNum'] = addNetworkMsg.length;
        
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
        
        formObj['paymentTermName'] = ["客人前台现付", '单结', '周结', '半月结', '月结','不固定', '三日结', '十日结','额度结'];
    
        console.log(formObj);
    
        //将获取的数据嵌入弹出的确认订单信息框中
        var $confirmOrderMsgStr = $(confirmOrderMsg(formObj));
        
        //用户点击确认之后，隐藏确认订单信息框
        $confirmOrderMsgStr.on('click','.confirm-order',function () {
          
          $('.confirm-order-msg-box').remove();
          $('.confirm-order-msg').remove();
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

module.exports = isComplete;

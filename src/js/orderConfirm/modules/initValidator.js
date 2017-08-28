//请求静态数据
const write = require('../testData/write.do.js');

//初始化验证
function InitValidator() {
    //国内允许输入中文或英文
    $.validator.addMethod("demostic", function(value, element) {
	    var demostic = /^([\u4e00-\u9fa5a-zA-Z]+)$/;
	    return this.optional(element) || (demostic.test(value));
    }, "只能输入中文或英文");
  
    //国外只允许输入英文
    $.validator.addMethod("abroad", function(value, element) {
	    var abroad = /^([a-zA-Z]+)$/;
	    return this.optional(element) || (abroad.test(value));
    }, "只能输入中文或英文");
  
    // 手机号码验证
    $.validator.addMethod("isMobile", function(value, element) {
	    var length = value.length;
	    var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
	    return this.optional(element) || (length == 11 && mobile.test(value));
    }, "请正确填写您的手机号码");
    
    //预付款验证
    $.validator.addMethod("imprest", function (value, element) {
    
    });
  
    if (write.content.staticInfo.country == 70007){
	    //国内
	    var o = {
	        rules: {
		        surname: {
		            required: true,
		            demostic: true
		        },
		        aftername: {
		            required: true,
		            demostic: true
		        },
		        emailMsg:{
		            email:true
		        },
		        faxMsg:{
		            number: true,
		            rangelength: [6,14]
		        },
		        phoneMsg:{
		            minlength : 11,
		            isMobile:true
		        }
	        },
	        messages: {
		        surname: {
		            required: '此处不能为空',
		        },
		        aftername: {
		            required: '此处不能为空',
		        },
		        emailMsg:{
		            email:'请输入正确的邮箱地址'
		        },
		        faxMsg:{
		            number: '请输入正确的传真号码',
		            rangelength: '传真号码长度必须在6-14之间'
		        },
		        phoneMsg:{
		            minlength : '手机号码长度为11',
		            isMobile:'请正确填写您的手机号码'
		        }
	        }
	    };
    }else{
	    //国外
	    var o = {
	        rules: {
		        surname: {
		            required: true,
		            abroad: true
		        },
		        aftername: {
		            required: true,
		            abroad: true
		        },
		        nationality: {
		            required: true,
		        },
		        emailMsg:{
		            email:true
		        },
		        faxMsg:{
		            number: true,
		            rangelength: [6,14]
		        },
		        phoneMsg:{
		            required : true,
		            minlength : 11,
		            isMobile:true
		        }
	        },
	        messages: {
		        surname: {
		            required: '此处不能为空',
		        },
		        aftername: {
		            required: '此处不能为空',
		        },
		        nationality: {
		            required: '此处不能为空',
		        },
		        emailMsg:{
		            email:'请输入正确的邮箱地址'
		        },
		        faxMsg:{
		            number: '请输入正确的传真号码',
		            rangelength: '传真号码长度必须在6-14之间'
		        },
		        phoneMsg:{
		            required : '请输入手机号',
		            minlength : '手机号码长度为11',
		            isMobile:'请正确填写您的手机号码'
		        }
	        }
	    };
	}
  
    $("#orderForm").validate(o);
}

module.exports = InitValidator;

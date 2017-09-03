
//初始化验证
function InitValidator(write) {

	//国内允许输入中文或英文
	$.validator.addMethod("demostic", function (value, element) {

		value = value.replace(/^\s+|\s+$/g, '');
		var	demostic = /^([\u4e00-\u9fa5a-zA-Z]+)$/;

		return this.optional(element) || (demostic.test(value));

	}, "只能输入中文或英文");


	//新增验证方法，依赖必须，即如果一条记录输入任何一项，则其他项也必须输入，这就叫“依赖必须”
	$.validator.addMethod("subRequired", function(value, element){
		
		value = value.replace(/^\s+|\s+$/g, "");
		var holder = $(element).attr("placeholder");
		
		if( value != "" && value != holder )	return true;
		
		var inputs = $(element).closest(".guest").find("input");
		
		for( var i = 0; i < inputs.length; i++ ){
			
			var o = inputs[i];
			
			var n_value = o.value.replace( $(o).attr("placeholder"), "" )
								 .replace(/^\s+|\s+$/g, "");
			
			if( n_value != "" )
				return false;
			
		}
		
		return true;
		
	}, "请输入该信息");


	var o = {
		rules: {
			surname: {
				required: true,
				subRequired: true,
			},
			aftername: {
				required: true,
				subRequired: true,
			},
			surname2: {
				subRequired: true,
			},
			aftername2: {
				subRequired: true,
			},
			voucherEmail: {
				email: true
			},
			voucherFax: {
				number: true,
				rangelength: [6, 14]
			},
			voucherMobile: {
				number: true,
				rangelength: [6, 14]
			}
		},
		messages: {
			voucherEmail: {
				email: '请输入正确的邮箱地址'
			},
			voucherFax: {
				number: '请输入正确的传真号码',
				rangelength: '传真号码长度必须在6-14之间'
			},
			voucherMobile: {
				number: '请填写正确的手机号码',
				rangelength: '手机号码长度必须为6位到14位之间',
			}
		}
	};


	if (write.content.staticInfo.country == 70007) {	//国内
		
		var o1 = {
			rules: {
				surname: {
					demostic: true,
				},
				aftername: {
					demostic: true
				},
				surname2: {
					demostic: true,
				},
				aftername2: {
					demostic: true,
				},
			},
		};

		$.extend(true, o, o1);

	} else {		//国外

		var o1 = {
			rules: {
				surname: {
					letter: true
				},
				aftername: {
					letter: true
				},
				nationality: {
					required: true,
				},
				surname2: {
					letter: true
				},
				aftername2: {
					letter: true
				},
				nationality2: {
					subRequired: true,
				},
			},
		};

		$.extend(true, o, o1);

	}

	$("#orderForm").validate(o);
}

module.exports = InitValidator;

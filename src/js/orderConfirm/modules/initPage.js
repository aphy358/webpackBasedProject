//引入主模板
const orderMain = require('../templates/orderMain.ejs');

//引入加床、加早、加宽带结构
const addBreakfast = require('./addBreakfast.js');
const addBed = require('./addBed.js');
const addNetwork = require('./addNetwork.js');

//引入入住信息结构
const guestMsg = require('../templates/guestMessage.ejs');

//请求静态数据
const write = require('../testData/write.do.js');

var writeStr;

//将获取到的数据动态加载到页面中
function getData() {
    //确认用户是否在线
    const checkData = require('../testData/check.do.js');
    if (checkData.isOnline == false) {
	  	alert("请先登录");
    } else {
	  	write.content.paymentTermName = ["客人前台现付", '单结', '周结', '半月结', '月结', '三日结', '十日结'];

	  	const content = write.content;

	  	if (write.success == true) {
	  		writeStr = orderMain(content);
		    //将替换好的结构添加到页面中
		    add();
		    
		    //再将入住信息替换好并添加进页面中
        var guestMsgStr = guestMsg(write);
        $('.guest-msg-box').append(guestMsgStr);
		}
	}
}


//将替换好的html结构添加到页面中以显示
function add() {
	$('.main').html(writeStr);

	//添加加床、加早、加宽带模块
	addBreakfast.run();
	addBed.run();
	addNetwork.run();
}

module.exports = {
	run : function () {
	    //加载页面时先到后台检查
	    getData();
	}
};

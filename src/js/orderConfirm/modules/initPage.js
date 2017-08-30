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

//引入工具类
const queryString = require('../../../common/util.js').queryString;

var writeStr;

//将获取到的数据动态加载到页面中
function getData() {
    //确认用户是否在线
    // const checkData = require('../testData/check.do.js');
    //处理参数
    var params = {
      hotelId: queryString('hotelId'),
      suppId: queryString('supplierId')
    };
    $.post('/internalOrder/check.do' ,params, function (checkData) {
      console.log(checkData);
      if (checkData.isOnline) {
        write.content.paymentTermName = ["客人前台现付", '单结', '周结', '半月结', '月结','不固定', '三日结', '十日结','额度结'];
    
        const content = write.content;
    
        if (write.success == true) {
          writeStr = orderMain(content);
          //将替换好的结构添加到页面中
          add();
      
          //再将入住信息替换好并添加进页面中
          var guestMsgStr = guestMsg(write);
          $('.guest-msg-box').append(guestMsgStr);
        }
      } else {
        //酒店已下线时，提醒客户
        $('.prompt-content').text('该酒店已下线');
        $('.info-prompt').show();
        $('.info-prompt-box').dialog();
        $('.info-prompt-box').dialog('open');
  
        //用户点击确定后，隐藏提示信息
        $('.max-bed-num-confirm button,.close-confirm').click(function () {
          $('.info-prompt').hide();
          $('.info-prompt-box').dialog('close');
          
          //关掉本页面
          CloseWebPage();
        });
      }
    });
    
    
}

function CloseWebPage() {
  if (navigator.userAgent.indexOf("MSIE") > 0) {
    if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
      window.opener = null; window.close();
    }
    else {
      window.open('', '_top'); window.top.close();
    }
  }
  else if (navigator.userAgent.indexOf("Firefox") > 0) {
    window.location.href = 'about:blank '; //火狐默认状态非window.open的页面window.close是无效的
    //window.history.go(-2);
  }
  else {
    window.opener = null;
    window.open('', '_self', '');
    window.close();
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

//引入主模板
const orderMain = require('../templates/orderMain.ejs');

//引入加床、加早、加宽带结构
const addBreakfast = require('./addBreakfast.js');
const addBed = require('./addBed.js');
const addNetwork = require('./addNetwork.js');

//引入入住信息结构
const guestMsg = require('../templates/guestMessage.ejs');

//引入页面主交互逻辑
const initActive = require('./initActive.js').run;
//引入公共函数
const Util = require('../../../common/util');

const getCheck = require('./sendRequest.js').getCheck;
const getWrite = require('./sendRequest.js').getWrite;

var writeStr;

//将获取到的数据动态加载到页面中
function getData() {
    //确认用户是否在线
    // const checkData = require('../testData/check.do.js');
    getCheck(function (checkData) {
      if (checkData.isOnline) {
        //请求页面中用于显示信息的数据
        // const write = require('../testData/write.do.js');
        getWrite(function (write) {
          //将hotelPriceStrs放入sessionStorage
          sessionStorage.setItem("hotelPriceStrs",write.content.hotelPriceStrs);
          if (write.success == true) {
            write.content.paymentTermName = ["客人前台现付", '单结', '周结', '半月结', '月结','不固定', '三日结', '十日结','额度结'];
    
            const content = write.content;
    
            writeStr = orderMain(content);
            //将替换好的结构添加到页面中
            add(write);
            
            //再将入住信息替换好并添加进页面中
            var guestMsgStr = guestMsg(write);
            $('.guest-msg-box').append(guestMsgStr);
          }
        })
        
      } else {
        //酒店已下线时，提醒客户
        layer.alert('该酒店已下线');
          
          //关掉本页面
          CloseWebPage();
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
function add(write) {
	$('.main').html(writeStr);

	//添加加床、加早、加宽带模块
	addBreakfast.run(write);
	addBed.run(write);
	addNetwork.run(write);
	//引入页面主交互逻辑
  // initActive(write);
  
  //IE9以下和IE9以上的浏览器采用不同方式加载插件（日期控件、验证控件）
  if( Util.ltIE9() ){
    Util.loadAsync(['../../static/js/datePick/datepickPacked.js', '../../static/js/validator/validatorPacked.js'], initActive);
  }else{
    require.ensure([], function(){
      require('../../../static/js/datePick/datepickPacked');
      require('../../../static/js/validator/validatorPacked');
      
      
      initActive(write);
    }, 'validator');
  }
}

module.exports = {
	run : function () {
	    //加载页面时先到后台检查
	    getData();
	}
};

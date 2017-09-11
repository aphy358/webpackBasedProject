//引入主模板
const orderMain = require('../templates/orderMain.ejs');

//引入加床、加早、加宽带结构
const addBreakfast = require('./addBreakfast.js');
const addBed = require('./addBed.js');
const addNetwork = require('./addNetwork.js');



//引入入住信息结构
const guestMsg = require('../templates/guestMessage.ejs');

//引入公共函数
const Util = require('../../../common/util');

const getWrite = require('./sendRequest.js').getWrite;

var writeStr;

//将获取到的数据动态加载到页面中
function getData() {
      getWrite(function (write) {
        $.orderInfo = write;
        //将hotelPriceStrs放入sessionStorage
        sessionStorage.setItem("hotelPriceStrs", write.content.hotelPriceStrs);
        if (write.success == true) {
          write.content.paymentTermName = ["客人前台现付", '单结', '周结', '半月结', '月结', '不固定', '三日结', '十日结', '额度结'];
          
          const content = write.content;
          
          writeStr = orderMain(content);
          //将替换好的结构添加到页面中
          add(write);
          
          //再将入住信息替换好并添加进页面中
          var guestMsgStr = guestMsg(write);
          $('.guest-msg-box').append(guestMsgStr);
        }
      });
  
}

//将替换好的html结构添加到页面中以显示
function add(write) {
  $('.main').html(writeStr);
  
  //添加加床、加早、加宽带模块
  addBreakfast();
  addBed();
  addNetwork();
  //引入页面主交互逻辑
  // initActive(write);
  
  //IE9以下和IE9以上的浏览器采用不同方式加载插件（日期控件、验证控件）
  if (Util.ltIE9()) {
    //引入页面主交互逻辑
    const initActive = require('./initActive.js').run;
    Util.loadAsync(['../../webpacked/static/js/datePick/datepickPacked.js', '../../webpacked/static/js/validator/validatorPacked.js'], initActive);
  } else {
    require.ensure([], function () {
      require('../../../static/js/datePick/datepickPacked');
      require('../../../static/js/validator/validatorPacked');
      
      //引入页面主交互逻辑
      const initActive = require('./initActive.js').run;
      
      initActive();
    }, 'validator');
  }
}

module.exports.getData = getData;

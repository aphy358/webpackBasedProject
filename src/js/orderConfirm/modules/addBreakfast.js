const addStr = require('../templates/addBreakfast.ejs');

//获取加早的数据
var getPrice = require('./sendRequest.js').getPrice;

var addData;


//将替换好的html结构添加到页面指定位置中
function add() {
  const write = $.orderInfo;
  getPrice(function (data) {
    addData = data;
  
    if (addData.result == "success") {
      addData.startDate = write.content.startDate;
      addData.endDate = write.content.endDate;
      
      var htmlStr = addStr(addData);
    
      $('.main').find('.breakfast-msg-box')
        .show()
        .html(htmlStr);
    }
  },1);
	
}

module.exports = add;

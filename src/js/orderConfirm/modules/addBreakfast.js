const addStr = require('../templates/addBreakfast.ejs');

//获取加早的数据
// var addData = require('../testData/addBreakfastData.js');
var getPrice = require('./sendRequest.js').getPrice;

var addData;

// const write=require('../testData/write.do.js');

//将替换好的html结构添加到页面指定位置中
function add(write) {
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

module.exports = {
	  run: function (write) {
	      //将替换好的html结构添加到页面指定位置中
        add(write);
    }
};

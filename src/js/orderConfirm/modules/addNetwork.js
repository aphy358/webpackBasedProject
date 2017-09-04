const addStr = require('../templates/addNetwork.ejs');

// var addData = require('../testData/addNetworkData.js');
var getPrice = require('./sendRequest.js').getPrice;

// const write=require('../testData/write.do.js');
var addData;

//将替换好的html结构添加到页面指定位置中
function add(write) {
  
  getPrice(function (data) {
    addData = data;
    if (data.result == "success") {
      addData.startDate = write.content.startDate;
      addData.endDate = write.content.endDate;
      addData.roomNum = write.content.roomNum;
    
      var htmlStr = addStr(addData);
    
    
      $('.main').find('.network-msg-box')
        .show()
        .html(htmlStr);
    }
  },3);
}

module.exports = {
	run: function (write) {
	    //将替换好的html结构添加到页面指定位置中
	    add(write);
	}
};

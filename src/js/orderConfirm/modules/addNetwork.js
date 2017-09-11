const addStr = require('../templates/addNetwork.ejs');

var getPrice = require('./sendRequest.js').getPrice;

var addData;

//将替换好的html结构添加到页面指定位置中
function add() {
  const write = $.orderInfo;
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

module.exports = add;

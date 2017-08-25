const addStr = require('../templates/addNetwork.ejs');

var addData = require('../testData/addNetworkData.js');

const write=require('../testData/write.do.js');

//将替换好的html结构添加到页面指定位置中
function add() {
  if (addData.result == "success") {
    addData.startDate=write.content.startDate;
    addData.endDate=write.content.endDate;
    
    var htmlStr = addStr(addData);
    
    
    $('.main').find('.network-msg-box')
      .show()
      .append(htmlStr);
  }
}



module.exports = {
  run: function () {
    //将替换好的html结构添加到页面指定位置中
    add();
    
  }
};

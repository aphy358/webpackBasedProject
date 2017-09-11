const addStr = require('../templates/addBed.ejs');

var getPrice = require('./sendRequest.js').getPrice;

var addData;

//将替换好的html结构添加到页面指定位置中
function add() {
  const write = $.orderInfo;
  if(write){
    getPrice(function (res) {
      addData = res;
      if (res.result == "success") {
        addData.startDate = write.content.startDate;
        addData.endDate = write.content.endDate;
        addData.roomNum = write.content.roomNum;
        addData.ofType = [];
        for (var i = 0; i < res.data[0].length; i++) {
          addData.ofType[i] = res.data[0][i].type;
        }
      
        var htmlStr = addStr(addData);
      
        $('.main').find('.bed-msg-box')
          .show()
          .html(htmlStr);
      
      
        //限制用户加床的总数
        limitBedNum();
      }
    }, 2);
  }
}

function limitBedNum() {
  //先判断用户加床总数是否超过房间数x每间房最多能加的床数
  var addBedTotal = addData.roomNum * addData.data[0][0].max;
  
  //把用户能添加的最大床数绑定给添加按钮
  $('.add-bed').attr("addBedTotal", addBedTotal);
}

module.exports = add;

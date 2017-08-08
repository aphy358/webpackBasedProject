
//首页景点门票 相关 js
module.exports = {
    run: function(){
        //初始化景点门票各项
        initTicketItems()
    }
}

//引入模板文件
const ticketT           = require('../templates/ticket.T.ejs');
const staticConfig      = require('../../../static/staticConfig');

//初始化景点门票各项
function initTicketItems(){
    $("#ticketWrap").html( ticketT({staticConfig}) );
}

//首页促销特卖 相关 js
module.exports = {
    run: function(){
        //初始化促销特卖
        initPromotion()
    }
}

//引入模板文件
const promotionT        = require('../templates/promotion.T.ejs');
const staticConfig      = require('../../../static/staticConfig');

//初始化促销特卖
function initPromotion(){
    $("#promotion").html( promotionT({staticConfig}) );
}
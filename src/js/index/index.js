//全局变量Promise，兼容ie
window.Promise = require('es6-promise');

//引入样式文件
require('../../sass/header.scss');
require('../../sass/footer.scss');
require('../../static/css/swiper.min.css');
require('../../sass/index/index.scss');

//引入模板文件
const hotelRecommandsT = require('../../html/index/templates/hotelRecommands.T.ejs');
const hotSalesT = require('../../html/index/templates/hotSales.T.ejs');

//引入js文件
const banner = require('./banner.js');

//引入测试数据
let hotSeasonData = require('./testData/hotSeasonData');

//处理轮播初始化
banner.isIE() ? banner.swiperOnIE() : banner.loadSwiper();


//加载当季热销
// $.getJSON('/user/indexHotSeasonData.do', function(data){
    if( hotSeasonData.returnCode === 1 ){
    debugger;
        $("#hotSalesWrap").html( hotSalesT({hotSeasonData}) );
    }
// })

const getCheck = require('./sendRequest.js').getCheck;

function isOnline() {
    //确认用户是否在线
    getCheck(function (checkData) {
        if (checkData.isOnline) {
            //如果用户在线，则准备利用订单信息渲染页面
            const initPage = require('./initPage.js');
            initPage.getData();

        } else {
            //酒店已下线时，提醒客户
            alert('该酒店已下线',function(){
                CloseWebPage();
            });
        }
    });
}

function CloseWebPage() {
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            window.opener = null;
            window.close();
        }
        else {
            window.open('', '_top');
            window.top.close();
        }
    }
    else if (navigator.userAgent.indexOf("Firefox") > 0) {
        window.location.href = 'about:blank '; //火狐默认状态非window.open的页面window.close是无效的
        //window.history.go(-2);
    }
    else {
        window.opener = null;
        window.open('', '_self', '');
        window.close();
    }
}

module.exports = {
    run: function () {
        isOnline();
    }
};

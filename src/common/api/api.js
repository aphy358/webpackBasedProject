var host='http://192.168.2.9:6061/';

var API={
  orderCheck:function(params,callback) {
    $.ajax({
      type: "post",
      url: host+'internalOrder/check.do',
      data: params,
      dataType: "jsonp",
      success:callback
    })
  }
};

module.exports=API;

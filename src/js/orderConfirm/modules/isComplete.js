//用户点击支付时，检查信息是否填写完整
function isComplete() {
  //因为其他地方都是预先填好的，用户只能改不能删，所以只需要验证入住信息与验证方式非在线验证时信息是否为空
  $('.payment-confirm button').click(function () {
    //******** 提交表单之前进行验证
    if (!$("#orderForm").myValid()){
      //将页面回滚到第一个验证不通过的地方
      
      //获取第一个验证不通过的元素的位置
      var failedTest=$('.error')[0].offsetTop-80;
      
      $('body').animate({
        scrollTop:failedTest+"px"
      },200);
      
      
      return;
    }else{
      return false;
    }
    
    //跳转到确认支付页面
  })
}

module.exports = isComplete;

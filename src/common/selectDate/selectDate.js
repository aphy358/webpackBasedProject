// const $ = require('../../static/js/jquery.min.js');

//加载样式
require('./redmond.datepick.css');

require('./jquery.plugin.js');
require('./jquery.datepick.js');
require('./jquery.datepick-zh-CN.js');

function selectDate(monthsToShow, startClass, endClass, minDate, MaxDate) {
  startClass.datepick({
    //设置日期格式
    dateFormat: 'yyyy-mm-dd',
    //设置一次性显示的月份数，此处为一次性显示两个月的视图
    monthsToShow: monthsToShow,
    //设置用户可选的日期，次数设置为当天之前的日期均不可选
    minDate: minDate,
    maxDate: MaxDate,
    
    changeMonth: false,
    //设置用户选择日期后发生的事件
    onSelect: function (selectDate) {
      
      //将选中的日期转换成与当天日期一样的格式
      selectDate = selectDate[0];
      
      
      selectDate.setDate(selectDate.getDate() + 1);
      
      
      endClass.datepick({
        //设置日期格式
        dateFormat: 'yyyy-mm-dd',
        //设置一次性显示的月份数，此处为一次性显示两个月的视图
        monthsToShow: monthsToShow,
        //设置用户可选的日期，次数设置为当天之前的日期均不可选
        minDate: minDate,
        maxDate: MaxDate,
        setDate: 0,
        changeMonth: false
      });
      
      endClass.datepick(
        'option', 'minDate', selectDate
      );
      
      endClass.val('');
      
      endClass.trigger('focus');
    }
  });
}


module.exports = {
  run: function (monthsToShow, startClass, endClass,minDate,maxDate) {
    selectDate(monthsToShow, startClass, endClass,minDate,maxDate);
  }
};

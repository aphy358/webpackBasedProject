

function selectDate(monthsToShow, startClass, endClass, minDate, MaxDate) {

  //开始日期的最大值要减少一天，以便给结束日期留下最后一个可选日期
  var startMaxDate = (new Date( MaxDate.replace(/-/g, '/') )).getTime() - 24 * 60 * 60 * 1000;
  startMaxDate = (new Date( startMaxDate )).Format("yyyy-MM-dd");
  
  //结束日期的最小值要增加一天
  var endMinDate = (new Date( minDate.replace(/-/g, '/') )).getTime() + 24 * 60 * 60 * 1000;
  endMinDate = (new Date( endMinDate )).Format("yyyy-MM-dd");
  
  startClass.datepick({
    //设置日期格式
    dateFormat: 'yyyy-mm-dd',
    //设置一次性显示的月份数，此处为一次性显示两个月的视图
    monthsToShow: monthsToShow,
    //设置用户可选的日期，次数设置为当天之前的日期均不可选
    minDate: minDate,
    maxDate: startMaxDate,
    
    changeMonth: false,
    //设置用户选择日期后发生的事件
    onSelect: function (selectDate) {
      
      //将选中的日期转换成与当天日期一样的格式
      selectDate = selectDate[0];
      
      
      selectDate.setDate(selectDate.getDate() + 1);
      
      
      endClass.datepick(
        'option', 'minDate', selectDate
      );
      
      endClass.val('');
      
      endClass.trigger('focus');
    }
  });

  endClass.datepick({
    //设置日期格式
    dateFormat: 'yyyy-mm-dd',
    //设置一次性显示的月份数，此处为一次性显示两个月的视图
    monthsToShow: monthsToShow,
    //设置用户可选的日期，次数设置为当天之前的日期均不可选
    minDate: endMinDate,
    maxDate: MaxDate,
    setDate: 0,
    changeMonth: false
  });
}



module.exports = {
  run: selectDate
};

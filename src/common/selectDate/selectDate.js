// const $ = require('../../static/js/jquery.min.js');

// require('./jquery.plugin.js');
// require('./jquery.datepick.js');
// require('./jquery.datepick-zh-CN.js');

function selectDate(){
	$('.start').datepick({
	//设置日期格式
	dateFormat: 'yyyy-mm-dd',
	//设置一次性显示的月份数，此处为一次性显示两个月的视图
	monthsToShow: 2,
	//设置用户可选的日期，次数设置为当天之前的日期均不可选
	minDate: 0,

	changeMonth: false,
	//设置用户选择日期后发生的事件
	onSelect: function(selectDate, today) {

		//将选中的日期转换成与当天日期一样的格式
		selectDate = selectDate[0];


		selectDate.setDate(selectDate.getDate() + 1);


		$('.end').datepick({
			//设置日期格式
			dateFormat: 'yyyy-mm-dd',
			//设置一次性显示的月份数，此处为一次性显示两个月的视图
			monthsToShow: 2,
			//设置用户可选的日期，次数设置为当天之前的日期均不可选
			minDate: 0,
			setDate: 0,
			changeMonth: false
		});

		$('.end').datepick(
			'option', 'minDate', selectDate
		);

		$('.end').val('');

		$('.end').trigger('focus');
	}
});
}


module.exports={
	run:function(){
		selectDate();
	}
}
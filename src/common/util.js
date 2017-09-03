
/*
* 对Date的扩展，将 Date 转化为指定格式的String
* 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
* 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
* 例子： 
* (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
* (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
*/
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,  //月份 
        "d+": this.getDate(), 		//日 
        "h+": this.getHours(), 		//小时 
        "m+": this.getMinutes(), 	//分 
        "s+": this.getSeconds(), 	//秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}



//判断是否是IE浏览器
function isIE(){ return !!window.ActiveXObject || "ActiveXObject" in window; }



//判断浏览器版本是否低于IE9
function ltIE9() {
    var 
    	browser   = navigator.appName,
    	b_version = navigator.appVersion,
    	version   = b_version.split(";");
    	
	if (version.length > 1) {
        var trim_Version = parseInt(version[1].replace(/[ ]/g, "").replace(/MSIE/g, ""));
        if (trim_Version < 9) {
            return true;
        }
    }

    return false;
}



/**
 * 在 < IE9 的环境下采用的按需加载 js 的方法
 * @param {插入的 script 标签的src} src 
 * @param {script 加载完成后的回调函数} callback 
 */
function loadAsync(src, callback){
	//如果是单个字符串，则修正为字符串数组
	if( typeof src === 'string' ){
		src = [src];
	}

	for (var i = 0; i < src.length; i++) {
		var script = document.createElement('script');
		script.src = src[i];

		//给最后加载的插件绑定 onload 事件，IE8不能正确处理 onload 事件，所以这里用 onreadystatechange 事件
		if( callback && $.type(callback) === 'function' && (i + 1) === src.length ){
			script.onreadystatechange = function() {
				if (script.readyState === 'loaded' || script.readyState === 'complete') {
					callback(); 
				} 
			}
		}
		document.body.appendChild(script);
	}
}



/**
 * 获取指定的url参数值
 * @param {指定的url参数名} name 
 */
function queryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	return r != null ? unescape(r[2]) : null;
}



//计算出两个日期之间所有的日期字符串
//比如传入 '2017-08-30' 和 '2017-09-01'，则输出['2017-08-30'、'2017-08-31']
function getDateEnuArr(d1, d2) {

	var arr = [d1];

	d1 = new Date(d1.replace(/-/g, '/'));
	d2 = new Date(d2.replace(/-/g, '/'));

	var dayCount = (d2 - d1) / (24 * 60 * 60 * 1000);

	while (--dayCount) {
		d1 = new Date(d1.getTime() + 24 * 60 * 60 * 1000);
		arr.push(d1.Format('yyyy-MM-dd'));
	}

	return arr;
}



/**
 * 该函数可以使用户在输入后，隔一段时间之后再执行目标函数
 * @param {*} func 表示传入的目标函数
 * @param {*} timeGap 表示时间间隔，单位毫秒
 * @param {*} option 表示传入回调函数的参数
 */
function processAfterTyping(func, timeGap, option){
	//启用一个全局变量存储最后一次输入操作的时间
	window.timeStampPAT = new Date().getTime();
	
	setTimeout(function(){
		//如果当前时间 - 最后一次输入操作的时间 >= 设置的时间间隔，那么执行最终的内部函数体func
		if( new Date().getTime() - window.timeStampPAT >= timeGap ){

			//用完之后再删除这个全局变量，释放内存
			delete window.timeStampPAT;

			if( func && typeof func === 'function' )	func( option );
		}
	}, ( timeGap || 300 ) );
}



module.exports = {
	isIE 	      	   : isIE,
	ltIE9 	      	   : ltIE9,
	loadAsync     	   : loadAsync,
	queryString   	   : queryString,
	getDateEnuArr 	   : getDateEnuArr,
	processAfterTyping : processAfterTyping
}

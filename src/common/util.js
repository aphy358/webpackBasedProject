
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

		//给最后加载的插件绑定 onload 事件
		if( callback && $.type(callback) === 'function' && (i + 1) === src.length ){
			script.onreadystatechange = function() {		// IE8不能正确处理 onload 事件
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



module.exports = {
	isIE 	    : isIE,
	ltIE9 	    : ltIE9,
	loadAsync   : loadAsync,
	queryString : queryString,
}

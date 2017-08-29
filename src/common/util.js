
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
 * 在 >= IE9 的环境下采用的异步加载 js 的方法
 * @param {异步模块的 src} src 
 * @param {异步加载模块后的回调函数} callback 
 * @param {异步加载的模块名称} chunkName 
 */
// function appendScript_gteIE9(src, callback, chunkName){
// 	require.ensure([], function(){
// 		//如果是单个字符串，则修正为字符串数组
// 		if( typeof src === 'string' ){
// 			src = [src];
// 		}
		
// 		for (var i = 0; i < src.length; i++) {
// 			require( src[i] );
// 		}
		
// 		if( callback && $.type(callback) === 'function' )	callback();
//     }, (chunkName || 'asyncChunk'));
// }



/**
 * 在 < IE9 的环境下采用的按需加载 js 的方法
 * @param {插入的 script 标签的src} src 
 * @param {script 加载完成后的回调函数} callback 
 */
function appendScript_ltIE9(src, callback){
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
 * 先判断浏览器环境，IE9 以上和 IE9 以下将使用不同的插件加载方式
 * @param {异步模块的 src} src 
 * @param {异步加载模块后的回调函数} callback 
 * @param {异步加载的模块名称} chunkName 
 */
// function loadAsync(src, callback, chunkName){
// 	ltIE9() ? appendScript_ltIE9(src, callback)
// 			: appendScript_gteIE9(src, callback, chunkName);
// }



module.exports = {
	isIE 		 : isIE,
	ltIE9 		 : ltIE9,
	appendScript_ltIE9 : appendScript_ltIE9,
}

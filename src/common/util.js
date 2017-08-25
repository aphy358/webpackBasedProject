
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
function loadAsync(src, callback, chunkName){
	require.ensure([], function(){
		if( typeof src === 'string' ){
			require( src );
		}else if( Object.prototype.toString.call(src) === '[object Array]' ){
			for (var i = 0; i < requiresrc.length; i++) {
				require( src[i] );
			}
		}
		
		callback();        
    }, (chunkName || 'asyncChunk'));
}



/**
 * 在 < IE9 的环境下采用的按需加载 js 的方法
 * @param {插入的 script 标签的src} src 
 * @param {script 加载完成后的回调函数} callback 
 */
function appendScript(src, callback){
	var script = document.createElement('script');
	script.src = src;
	script.onload = callback;
	document.body.appendChild(script);
}



module.exports = {
	isIE 		 : isIE,
	ltIE9 		 : ltIE9,
	loadAsync 	 : loadAsync,
	appendScript : appendScript
}

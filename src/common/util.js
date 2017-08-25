
//判断是否是IE浏览器
function isIE(){ return !!window.ActiveXObject || "ActiveXObject" in window; }


module.exports = {
	isIE : isIE,
	
}

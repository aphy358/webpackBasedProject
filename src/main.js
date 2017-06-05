// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

require.ensure('./components/commonHead/commonHead.js', function(data){
	const commonHeadjs = require('./components/commonHead/commonHead.js')
	$('#app').html(commonHeadjs.tmp())
}, null, 'commonHead');

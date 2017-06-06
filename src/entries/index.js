// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

require.ensure('~/commonHead/commonHead.js', function(data) {
    const commonHeadjs = require('~/commonHead/commonHead.js')
    $('#mainContent').html(commonHeadjs.tmp())
}, null, 'commonHead');
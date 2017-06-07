// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
require.ensure('~/commonHeader/commonHeader.js', function(data) {
    const commonHeaderjs = require('~/commonHeader/commonHeader.js')
    $('#mainContent').html(commonHeaderjs.tmp())
}, null, 'commonHeader');
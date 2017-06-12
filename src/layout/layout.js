var header = require('./header.ejs');
var footer = require('./footer.ejs');
var layout = require('./layout.ejs');
var venderConfig = require('./venderConfig.js');

module.exports = {
    /**
     * pageTitle：         页面标题
     * content：           页面主体内容
     * no_Header_Footer：  指示页面有无Header和Footer，默认有，如果传了为true的参数，则无
     */
    run(pageTitle, content, no_Header_Footer) {
        const renderData = {
            pageTitle,
            header: no_Header_Footer ? '' : header({venderConfig}),  //这里一定要传对象，而不能单纯的只传一个“venderConfig”
            footer: no_Header_Footer ? '' : footer({venderConfig}),
            content,
            venderConfig
        };
        return layout(renderData);
    },
}
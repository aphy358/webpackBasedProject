const header = require('./header.ejs');
const footer = require('./footer.ejs');
const layout = require('./layout.ejs');
const staticConfig = require('../static/staticConfig.js');

module.exports = {
    /**
     * pageTitle：         页面标题
     * content：           页面主体内容
     * no_Header_Footer：  指示页面有无Header和Footer，默认有，如果传了为true的参数，则无
     */
    run(pageTitle, content, no_Header_Footer) {
        const renderData = {
            pageTitle,
            header: no_Header_Footer ? '' : header({staticConfig}),  //这里一定要传对象，而不能单纯的只传一个“staticConfig”
            footer: no_Header_Footer ? '' : footer({staticConfig}),
            content,
            staticConfig
        };
        return layout(renderData);
    },
}
const header = require('./header.ejs');
const footer = require('./footer.ejs');
const layout = require('./layout.ejs');
const staticConfig = require('../static/staticConfig.js');

let bannerItems = 
    [
        { href : '#', content : '首页' },
        { href : '#', content : '国内酒店' },
        { href : '#', content : '国际酒店' },
        { href : '#', content : '门票' },
        { href : '#', content : '酒店集团' },
        { href : '#', content : '节日促销' },
    ];
    

module.exports = {
    /**
     * pageTitle：         页面标题
     * content：           页面主体内容
     * no_Header_Footer：  指示页面有无Header和Footer，默认有，如果传了为true的参数，则无
     */
    run(pageTitle, content, options) {
        const renderData = {
            pageTitle,
            header: options && options.no_head ? '' : header({bannerItems : bannerItems}),  //这里一定要传对象，而不能单纯的只传一个“staticConfig”
            footer: options && options.no_foot ? '' : footer(),
            content,
            staticConfig
        };
        return layout(renderData);
    },
}
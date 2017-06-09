var header = require('./header.ejs');
var footer = require('./footer.ejs');
var layout = require('./layout.ejs');
var verderConfig = require('./venderConfig');

module.exports = {
    run(pageTitle, content) {
        const renderData = {
            pageTitle,
            header: header(),
            footer: footer(),
            content,
            verderConfig
        };
        return layout(renderData);
    },
}
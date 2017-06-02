# webpackBasedProject

webpack 在线文档：
https://doc.webpack-china.org/guides/ 

1、新建一个项目文件夹 webpack sample

2、初始化一个项目，命令：npm init,(后续别人安装只要命令：npm install即可。)

3、安装 Webpack，命令：npm install --dev-save webpack,( 安装webpack的同时，将相关信息写入package.json文件的devDependencies属性 )

4、新建文件 .gitignore，内容为 '/node_modules/'，意思为git忽略文件夹node_modules下的所有文件

5、npm install --dev-save css-loader style-loader extract-text-webpack-plugin
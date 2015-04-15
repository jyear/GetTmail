/**
 * Created by 图公子 on 2015/4/1.
 */
var system = require('system');
var url = system.args[4];
var fs=require('fs');

var casper = require('casper').create({
    //clientScripts: ["jquery.js"],
    verbose: false,
    logLevel: 'debug',
    pageSettings: {
        loadImages: false, // The WebPage instance used by Casper will
        loadPlugins: false // use these settings
    }
});
phantom.outputEncoding = "gbk";//

casper.start(url, function() {
    casper.GetDetailUrl(url);
});
casper.then(function () {
    this.scrollTo(100,1700);
});
casper.waitForSelector("a[href='#J_Reviews']",function(){
    this.echo("[info] 发现累计评价按钮！!");
    this.click("a[href='#J_Reviews']");
}, function () {
    this.echo("[info] no find href!");
});
casper.waitForSelector("td.tm-col-master",function(){
    this.echo("[info]发现评论！");
}, function () {
    this.echo("[info] no find td!");
});
casper.then(function () {

    //console.log(this.getHTML('td.tm-col-master'));
    this.emit('save', this.getHTML("div.rate-grid"));
});
casper.run();


casper.GetDetailUrl = function(detailUrl) {
    casper.thenOpen(detailUrl, function() {
        console.log(this.getCurrentUrl());
    });
};

casper.on("save", function (data) {
    //this.cwsave("dd.html",data);
    console.log(data);
});

casper.on('console', function (line) {
    console.log(line);
});
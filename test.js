/**
 * Created by 图公子 on 2015/4/14.
 */
var fs=require('fs'),
    url=require('url'),
    page = require('webpage').create(),
    server = require('webserver').create();//创建服务


var config=JSON.parse(fs.read('./reptileConfig.json'));
var ipPort=config.gome.detail.ip_address+":"+config.gome.detail.port;

page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
page.onResourceRequested = function(requestData, request) {
    //if ((/http:\/\/.+?\.css/gi).test(requestData['url'])) {
    //    request.abort();
    //}
    if ((/http:\/\/.*baidu/gi).test(requestData['url'])) {
        request.abort();
    }
    if ((/http:\/\/.*gif/gi).test(requestData['url'])) {
        request.abort();
    }
    if ((/http:\/\/.+?\.jpg/gi).test(requestData['url'])) {
        request.abort();
    }
    if ((/http:\/\/.+?\.png/gi).test(requestData['url'])) {
        request.abort();
    }
    //if ((/http:\/\/.+?\.js/gi).test(requestData['url'])) {
    //    request.abort();
    //}
};
page.onConsoleMessage = function(msg) {
    console.log(msg);
};
page.onError = function(msg, trace) {

    var msgStack = ['ERROR: ' + msg];

    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
        });
    }

    console.error(msgStack.join('\n'));

};

server.listen(ipPort, function (request,response) {
    var bt=Date();
    console.log(bt);
    //var wholeUrl = url.parse(ipPort+request.url,true,true);
    //var address=wholeUrl.query.url||"";
    //var address=address.toString();
    //console.log(address);
    var address="http://www.gome.com.cn/category/cat10000049.html";
        page.open(address, function (status) {
            console.log(status);
            console.log(Date());
            response.statusCode = 200;
            response.write(status);
            response.close();

        });


});
console.log("sever running at "+ipPort);
/**
 * Created by 图公子 on 2015/4/10.
 */

var fs=require('fs'),
    url=require('url'),

    server = require('webserver').create();//创建服务


var config=JSON.parse(fs.read('./reptileConfig.json'));
var ipPort=config.gome.detail.ip_address+":"+config.gome.detail.port;




server.listen(ipPort, function (request,response) {

    var page = require('webpage').create();
    page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:37.0) Gecko/20100101 Firefox/37.0';
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

    console.log('Request at ' + new Date());
    //console.log(JSON.stringify(request, null, 4));
    var wholeUrl = url.parse(ipPort+request.url,true,true);
    var detialUrl=wholeUrl.query.url||"";
    var detialUrl=detialUrl.toString();
    console.log(detialUrl);
    if(detialUrl==""){
        response.statusCode = 200;
        response.write('get none website!');
        response.closeGracefully();
        page.close();
    }
    else{
        //var testUrl="http://item.gome.com.cn/9133450979-1122290197.html";
        page.open(detialUrl, function (status) {
            if (status !== 'success') {
                console.log('Unable to open detial website!');
                response.write('Unable to open detial website!');
                response.closeGracefully();
                page.close();
            } else {
                page.scrollPosition = {
                    top: 1700,
                    left: 0
                };//下拉以让其加载
                waitFor(function () {//等待加载
                    return page.evaluate(function () {
                        return $("#prdPrice")!=null
                    });
                }, function () {//加载完成
                    var price=page.evaluate(function () {//价格
                        //console.log($("#prdPrice")[0].innerHTML);
                        return $("#prdPrice")[0].innerHTML;
                    });
                    var pincnt=page.evaluate(function () {//评论人数（国美没有销售数量）
                        //console.log($("#prdPrice")[0].innerHTML);
                        return $("#pincnt")[0].innerHTML;
                    });
                    var prd_data=page.evaluate(function () {//具体参数，可能会包括部分详情页的文字
                        //console.log($("#prdPrice")[0].innerHTML);
                        return $("ul.specbox")[0].innerHTML;
                    });
                    //page.evaluate(function () {
                    //    $("a[class='pingjia_header']").click();//点击评价
                    //    console.log('click success!');
                    //});
                    //page.scrollPosition = {
                    //    top: 1700,
                    //    left: 0
                    //};//下拉以让其加载
                    response.statusCode = 200;
                    //response.setEncoding="uft-8";
                    response.write('<html>');
                    response.write('<head>');
                    response.write('<meta charset="UTF-8">');
                    response.write('</head>');
                    response.write('<body>');
                    response.write("<div id='detialUrl'>"+detialUrl+"</div>");
                    response.write("<div id='price'>"+price+"</div>");
                    response.write("<div id='pincnt'>"+pincnt+"</div>");
                    response.write("<div id='prd_data'>"+prd_data+"</div>");
                    //response.write("<div id='common'>"+common+"</div>");
                    response.write('</body>');
                    response.write('</html>');
                    response.closeGracefully();
                    page.close();
                    //waitFor(function () {//等评论详情出现
                    //    return page.evaluate(function () {
                    //        return $("li[class='oh']").length!=0||
                    //            pincnt==0;
                    //    });
                    //}, function () {
                    //    //已经在reviews这个文件里面处理评论
                    //    //var common=page.evaluate(function () {//评论详情
                    //    //    return $("#j-comment-section")[0].innerHTML;
                    //    //});
                    //
                    //
                    //},4000);
                },10000);
            }
        });
    }

});


console.log("sever running at "+ipPort);




function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);//TODO (1,0)不应该直接退出
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 150); //< repeat check every 250ms
}


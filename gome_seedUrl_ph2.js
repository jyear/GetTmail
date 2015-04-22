/**
 * Created by 图公子 on 2015/4/7.
 */
var fs=require('fs'),
    url=require('url'),
    server = require('webserver').create();//创建服务


var config=JSON.parse(fs.read('./reptileConfig.json'));
var ipPort=config.gome.seedUrl.ip_address+":"+config.gome.seedUrl.port;
var seedUrl=config.gome.seedUrl.seedUrl;




server.listen(ipPort, function (request,response) {
    var page = require('webpage').create();
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
        page.onConsoleMessage = function(msg) {
        console.log(msg);
    };
        //    page.onResourceRequested = function(requestData, request) {
//    //if ((/http:\/\/.+?\.css/gi).test(requestData['url'])) {
//    //    request.abort();
//    //}
//    if ((/http:\/\/.*baidu/gi).test(requestData['url'])) {
//        request.abort();
//    }
//    if ((/http:\/\/.*gif/gi).test(requestData['url'])) {
//        request.abort();
//    }
//    if ((/http:\/\/.+?\.jpg/gi).test(requestData['url'])) {
//        request.abort();
//    }
//    if ((/http:\/\/.+?\.png/gi).test(requestData['url'])) {
//        request.abort();
//    }
//    //if ((/http:\/\/.+?\.js/gi).test(requestData['url'])) {
//    //    request.abort();
//    //}
//};
//TODO （0,0）优化加载资源
    console.log('Request at ' + new Date());
    //var testrul2="http://www.gome.com.cn/category/cat10000049.html";
    page.open(seedUrl, function (status) {//打开首页，开始爬取页面内容
        if (status !== 'success') {
            console.log('Unable to post!');
        } else {
            //if(page.injectJs('jquery.js')){
            //    console.log("yes!");
            //}else{
            //    console.log("no!");
            //}
            var hrefAll="";
            page.scrollPosition = {
                top: 1700,
                left: 0
            };//下拉以让其加载
            nextPage(page,hrefAll,response);
        }
    });
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
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
}

function nextPage(page,hrefListALL,response){
    waitFor(function () {//等待加载完毕
            return  page.evaluate(function () {
                return $('div.pop-icon').is(':hidden');
            });
    }, function () {
        var pageNum=page.evaluate(function () {//页码
            return $("span.num em").text();
        });
        var hrefList=page.evaluate(function () {
            var inneralist = "";
            $("#prodByAjax p[class='name'] a").each(function (e) {
                //console.log((this));
                inneralist = inneralist + this + ",";
            });
            console.log("inner length:" + inneralist.split(',').length);
            return inneralist.toString();

        });
        hrefListALL = hrefListALL + hrefList;
        //console.log(hrefList);
        var lastPage= page.evaluate(function () {
            //console.log($("a[class='next disable']")[0]);
            if($("a[class='next disable']")[0]==undefined){//没到最后一页
                $("a[class='next']")[0].click();//点击下一页
                return false;
            }else{
                return true;
            }
        });
        if(lastPage){
            console.log("presend length:" + hrefListALL.split(',').length);
            response.statusCode = 200;
            response.write(hrefListALL);
            response.closeGracefully();
            page.close();
            //phantom.exit(0);
        }else{//
            console.log("pageNumber:"+pageNum);
            console.log("listLength:"+hrefListALL.length);
            nextPage(page,hrefListALL,response);

        }

    },10000);
}
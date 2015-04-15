/**
 * Created by 图公子 on 2015/4/13.
 */
var fs=require('fs'),
    url=require('url'),
    server = require('webserver').create();//创建服务


var config=JSON.parse(fs.read('./reptileConfig.json'));
var ipPort=config.gome.reviews.ip_address+":"+config.gome.reviews.port;



server.listen(ipPort, function (request,response) {
    var page = require('webpage').create();
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

    var wholeUrl = url.parse(ipPort+request.url,true,true);
    var detialUrl=wholeUrl.query.url||"";
    var detialUrl=detialUrl.toString();//
    //console.log(detialUrl);
    if(detialUrl==""){
        response.statusCode = 200;
        response.write('get none website!');
        response.closeGracefully();
        page.close();
    } else{
        page.open(detialUrl, function (status) {
            if(status!=="success"){
                console.log('Unable to open detial for reviews!');
                response.write('Unable to open detial for reviews!');
                response.closeGracefully();
                page.close();
            }else{
                page.scrollPosition = {
                    top: 2700,
                    left: 0
                };//下拉以让其加载
                var address=page.evaluate(function () {
                    //console.log($("a.allcmt")[0].href);
                    return $("a.allcmt")[0].href;
                });
               ;
                page.open(address, function (status) {//打开网页，开始爬取页面内容
                    if (status !== 'success') {
                        console.log('Unable to open reviews website!');
                    } else {
                        page.scrollPosition = {
                            top: 1700,
                            left: 0
                        };
                        var pageContent="";
                        var curNum=1;
                        console.log('begin...');
                        nextReviews(page,curNum,pageContent,response);
                    }
                });
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

function nextReviews(page,curNum,pageContent,response){
    waitFor(function () {//等待加载完毕
        if(curNum==1){
            return  page.evaluate(function (curNum) {
                return $("a[class='cur num']").text()==curNum;
            },curNum);
        }else{
            return page.evaluate(function () {
                return $("li.oh").length!=0;
            });
        }

    }, function () {

        var curPageContent=page.evaluate(function () {
           return $("div[class='appraiseType  dn']")[0].innerHTML+
               $("ul[class='replyListWrap dn']")[0].innerHTML;
        });
        //console.log(curPageContent);
        pageContent=pageContent+curPageContent;
        //console.log(hrefList);
        var lastPage= page.evaluate(function () {
            //console.log($("a[class='next disable']")[0]);
            if($("a[class='gpnext gno']").is(':hidden')){//最后一页
                return true;

            }else{
                $("a[class='gpnext']").click();
                return false;
            }
        });
        if(lastPage){
            var detialUrl=page.url;
            response.statusCode = 200;
            response.write('<html>');
            response.write('<head>');
            response.write('<meta charset="UTF-8">');
            response.write('</head>');
            response.write('<body>');
            //response.write("<div id='url'>"+price+"</div>");
            response.write("<div id='reviews'>"+pageContent+"</div>");
            response.write("<div id='detialUrl'>"+detialUrl+"</div>");
            response.write('</body>');
            response.write('</html>');
            response.closeGracefully();
            page.close();
            //phantom.exit(0);
        }else{
            console.log("pageNumber:"+curNum);
            console.log("listLength:"+pageContent.length);
            curNum++;
            nextReviews(page,curNum,pageContent,response);

        }

    },11000);
}

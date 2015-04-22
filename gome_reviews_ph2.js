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
        console.log('get none website!');
        response.closeGracefully();
        page.close();
    } else{
        console.log("详情页：" + detialUrl);
        page.open(detialUrl, function (status) {
            if(status!=="success"){
                console.log('Unable to open detial for reviews!');
                //response.write('Unable to open detial for reviews!');
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
                console.log("评论页：" + address);
                page.open(address, function (status) {//打开网页，开始爬取页面内容
                    if (status !== 'success') {
                        console.log('Unable to open reviews website!');
                        response.statusCode = 200;
                        //response.write('Unable to open reviews website!');
                        response.closeGracefully();
                        page.close();
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
                    //phantom.exit(1);//TODO (1,0)不应该直接退出
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

        var curCommList = page.evaluate(function () {
            var backList = "";
            var commList = $("li.oh");
            //console.log(commList);
            if (commList == undefined || null) {

            } else {
                commList.each(function (e) {
                    var commLength = commList[e].children.length;//有的地方长度不一，影响取值；默认应该是5，有时候是6
                    var time = commList[e].children[1].children[1].text.toString();
                    var xinde = commList[e].children[commLength - 3].textContent.toString();
                    var review = commList[e].children[commLength] == undefined ? "无评论回复" : commList[e].children[0].children[1].innerHTML.toString();
                    backList = backList + (time + '|' + xinde + '|' + review + '|||');
                });
            }
            return backList;
            //return $("ul[class='replyListWrap dn']")[0].innerHTML;
            //+$("div[class='appraiseType  dn']")[0].innerHTML//好评中评差评数
        });
        //console.log(curPageContent);
        pageContent = pageContent + curCommList;
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
            //response.statusCode = 200;
            fs.write("ddd.txt", pageContent);
            response.write(pageContent);
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

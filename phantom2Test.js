/**
 * Created by 图公子 on 2015/4/7.
 */
var url=require('url');
var webserver = require('webserver');
var server = require('webserver').create();//创建服务
var page = require('webpage').create();


    MAX=0;
var service = server.listen(3000, function(request, response) {
    var obj = url.parse(ip_server+request.url,true,true);//将url分解得到参数
    var pastfilter=obj.query.filter||"";
    var filter=pastfilter.toString();//分解出的参数，css选择器根据这个参数来进行选择，例如td.tm-col-master
    var data = "";//要返回的数据

    var testurl="http://detail.tmall.com/item.htm?spm=a220m.1000858.1000725.9.hLC38S&id=19842770800&skuId=31668477891&areaId=621200&cat_id=2&rn=5ee7cf53112db3113c042a183c048fdf&standard=1&user_id=470168984&is_b=1";

    page.open(testurl, function (status) {
       // get page Title
        //phantom.exit();
    });
    page.scrollPosition = {
        top: 100,
        left: 1700
    };
    waitFor(function() {
        // Check in the page if a specific element is now visible
        return page.evaluate(function() {
            return $("#blog-news").is(":visible");
        });
    }, function() {
        console.log("The sign-in dialog should be visible now.");
        //phantom.exit();
    });
    //page.open('http://phantomjs.org', function (status) {
    //    var content = page.content;
    //    console.log('Content: ' + content);
    //    phantom.exit();
    //});

    //response.statusCode = 200;
    //response.write('<html><body>Hello!'+MAX+'</body></html>');
    //MAX++;
    //response.close();
});
console.log("sever running......");


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
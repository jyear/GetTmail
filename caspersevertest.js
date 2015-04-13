//define ip and port to web service
var ip_server = '127.0.0.1:3045';
var url=require('url');
MAX=0;
//includes web server modules
var server = require('webserver').create();//创建服务

//start web server
var service = server.listen(ip_server, function(request, response) {
    var obj = url.parse(ip_server+request.url,true,true);//将url分解得到参数
    var pastfilter=obj.query.filter||"";
    var filter=pastfilter.toString();//分解出的参数，css选择器根据这个参数来进行选择，例如td.tm-col-master
    var data = "";//要返回的数据
    var casper = require('casper').create({
        //clientScripts: ["jquery.js"],//暂时没用jquery，用的css选择器选择出需要的
        verbose: false,//是否输出信息到调试台
        logLevel: 'info',//输出信息级别，debug info warn
        pageSettings: {
            loadImages: false, // The WebPage instance used by Casper will
            loadPlugins: false // use these settings
        }
    });
    phantom.outputEncoding = "gbk";//网页字符编码
    casper.GetDetailUrl = function(detailUrl) {
        casper.thenOpen(detailUrl, function() {
            console.log(this.getCurrentUrl());//打印出当前网址
        });
    };
    casper.on('console', function (line) {
        console.log(line);
    });//将casper的打印环境转发到外围js环境下
    //var testurl="http://detail.tmall.com/item.htm?spm=a220m.1000858.1000725.9.hLC38S&id=19842770800&skuId=31668477891&areaId=621200&cat_id=2&rn=5ee7cf53112db3113c042a183c048fdf&standard=1&user_id=470168984&is_b=1";
var guomeiURL="http://www.gome.com.cn/category/cat10000049.html";
    casper.start(guomeiURL, function() {
    });
    casper.then(function () {
        this.scrollTo(100,1700);//下拉，让网页的延迟加载元素加载出来
    });
    casper.waitForSelector("a[href='#J_Reviews']",function(){
        this.echo("[info] 发现累计评价按钮！!");
        this.click("a[href='#J_Reviews']");
    }, function () {
        this.echo("[info] no find href!");
    });//等累计评价按钮出来以后点击之
    casper.waitForSelector("td.tm-col-master",function(){
        this.echo("[info] 发现评论！");
    }, function () {
        this.echo("[info] no find td!");
    });//等待评论出现
    casper.then(function () {
            this.echo(filter);
        try{            data=this.getHTML(filter);
        }catch (e){
            if(e)
            this.echo("none suitable block");
            data=this.getHTML();
        }


        //通过传入的参数选择需要的部分，如果有多个，返回第一个
    });
    casper.run(function() {
            response.statusCode = 200;
            response.setEncoding("gbk");//设置返回数据的编码
            MAX=MAX+1;
            response.write(data);
            response.close();
        this.echo("done.");
    });

});
console.log('Server running at http://' + ip_server+'/');
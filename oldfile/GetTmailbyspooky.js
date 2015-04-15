try {
    var Spooky = require('spooky');
} catch (e) {
    var Spooky = require('../lib/spooky');
}
var testurl="http://detail.tmall.com/item.htm?spm=a220m.1000858.1000725.9.hLC38S&id=19842770800&skuId=31668477891&areaId=621200&cat_id=2&rn=5ee7cf53112db3113c042a183c048fdf&standard=1&user_id=470168984&is_b=1";
var spooky = new Spooky({
    child: {
        transport: 'http'
    },
    casper: {
        logLevel: 'info',
        verbose: false,
        pageSettings: {
            loadImages: false, // The WebPage instance used by Casper will
            loadPlugins: false // use these settings
            //outputEncoding: 'utf-8'

        }
    }
    //phantom:{
        //outputEncoding: 'utf-8'
    //}

}, function (err) {
    if (err) {
        e = new Error('Failed to initialize SpookyJS');
        e.details = err;
        throw e;
    }
    spooky.start(testurl, function () {
        this.scrollTo(100,1700);
    });

    spooky.waitForSelector("a[href='#J_Reviews']",function(){
        this.echo("[~] find #J_Reviews!");
        this.click("a[href='#J_Reviews']");
    }, function () {
        this.echo("[~] no find href!");
    });
    spooky.waitForSelector("td.tm-col-master",function(){
        this.echo("[~] find td!");
    }, function () {
        this.echo("[~] no find td!");
    });
    spooky.then(function () {
        //this.cwsave("ddddddd.html",this.getHTML());
        this.emit('save', this.getHTML());
    });
    spooky.run();


    spooky.on('console', function (line) {
        console.log(line);
    });

    spooky.on('save', function (data) {
        var fs=require('fs');
        var cheerio=require('cheerio');
        //var iconv=require('iconv-lite');

        //var orData=iconv.decode(data,'utf-8');
        //var saveData=iconv.encode(orData,'gbk');
        //console.log(data);
        var $=cheerio.load(data);
        //this.cwsave("ddd.html",data);
        console.log($("div[class='tm-rate-date']").text());//评价日期
        console.log($("div[class='tm-rate-content']").text());//评价内容

        //fs.unlinkSync('dd.html');
        //fs.writeFile('dd.html',data,null, function (err) {
        //    if (err) throw err;
        //    console.log('[info] It\'s saved!');
        //});
    });
});

//phantom.outputEncoding = "utf-8";
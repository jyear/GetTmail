/**
 * Created by 图公子 on 2015/4/7.
 */

var httpmethod=require('./oldfile/httpmethod'),
    cheerio=require('cheerio'),
    nodegrass = require('nodegrass'),
    fs = require('fs'),
    Prod_detail = require('./mongo/Prod_detail'),
    comment_detail = require('./mongo/comment_detail');

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/gome_cw');

var IP=" http://127.0.0.1";
var seedUrl = IP + ":3500";

var errDetailList = [];

fs.readFile('./reptileConfig.json', function (err, data) {
    if (err) {
        console.log(err);
    }
    var config = JSON.parse(data);
    btime = new Date();
    console.log(btime);
    var detialPortList = config.gome.detail.port.split(',');

    nodegrass.get(seedUrl, function (data, status, header) {
        var portNum = 1;//切换detail服务器
        var dataList = data.split(',');
        console.log(dataList.length);
        dataList.forEach(function (e) {
            if (e == "" || e == undefined) {
                //do something.....
            } else {
                var curPort = detialPortList[portNum % detialPortList.length];
                portNum++;
                nodegrass.get(IP + ":" + curPort + "/?url=" + e, function (data, status, header) {
                    console.log(e);
                    if (!status) {
                        errDetailList.pop(e);
                    } else {
                        addDetailToMongo(e, data);
                    }
                });
            }

        });
    });
});

function addDetailToMongo(e, data) {
    //todo 把e（网址）和data（json字符串）存到数据库里面
    //data格式
    //{"price":¥1999,"pincnt":1326,"prd_data":品牌,长虹（CHANGHONG）,产品型号,长虹彩电LED39C3000,型号,长虹彩电LED39C3000,产品类型,LED电视,颜色,黑色,功能,网络
    //电视（上网冲浪）,含底座尺寸,886×583×195,单屏尺寸,886×531×50,含底座重量（kg）,10.2kg,单屏重量（kg）,8.3kg,接口,支持,电源功率（w）,55w,待机功率（w）,
    //＜0.5w,屏幕尺寸,37-39英寸,分辨率,高清（1366*768）,刷屏率,60,响应时间,4ms,智能电视,不支持}
}

function handleErrDetailUrl(errorList) {

    if(errorList.length>10){
        errorList.forEach(function (e) {
            nodegrass.get(IP+":"+"3600/?url="+e, function (html,status,header) {
                errorList.pop(e);
                if (!status) {
                    errorList.push(e);
                    //先将errorList pop出来，防止重复访问，失败以后再重新加入errorList
                }
            });
        });
    }
};

setInterval(handleErrDetailUrl, 10000, errDetailList);//纠错
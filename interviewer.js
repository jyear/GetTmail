/**
 * Created by 图公子 on 2015/4/7.
 */

var cheerio = require('cheerio'),
    nodegrass = require('nodegrass'),
    fs = require('fs'),
    Prod_detail = require('./mongo/Prod_detail'),
    comment_detail = require('./mongo/comment_detail');

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/gome_cw');

var IP=" http://127.0.0.1";
var seedUrl = IP + ":3500";

var errDetailList = [];
var errCommentList = [];

fs.readFile('./reptileConfig.json', function (err, data) {
    if (err) {
        console.log(err);
    }
    var config = JSON.parse(data);
    btime = new Date();
    console.log(btime);
    var detialPortList = config.gome.detail.port.split(',');
    var commentPort = config.gome.reviews.port;
    //nodegrass.get(seedUrl, function (data, status, header) {
    //    var portNum = 1;//切换detail服务器
    //    var dataList = data.split(',');
    //    console.log("detail页面数量："+dataList.length);
    //    dataList.forEach(function (e) {
    //        if (e == "" || e == undefined) {
    //            //do something.....
    //        } else {
    //            var curPort = detialPortList[portNum % detialPortList.length];
    //            portNum++;
    //            nodegrass.get(IP + ":" + curPort + "/?url=" + e, function (data, status, header) {
    //                if (!status) {
    //                    errDetailList.push(e);
    //                } else {
    //                    addDetail2Mongo(e, data, function (err) {
    //                        if(err){
    //                            errDetailList.push(e);
    //                        }
    //                    });
    //                }
    //            });
    //        }
    //
    //    });
    //});
    nodegrass.get(seedUrl, function (data, status, header) {
        var dataList = data.split(',');
        dataList.forEach(function (e) {
            if (e == "" || e == undefined) {
                //do something.....
            } else {
                nodegrass.get(IP + ":" + commentPort + "/?url=" + e, function (data, status, header) {
                    if (!status) {
                        errCommentList.push(e);
                    } else {
                        data = data.split('|||');

                        addComment2Mongo(e, data, function (err) {
                            if (err) {
                                errCommentList.push(e);
                            }
                        });
                    }
                });
            }
        });
    })
});

function addDetail2Mongo(url, data, cb) {
    console.log("begin mongo...");
    data = data.split(',');

    var detailJson = {};

    try {
        list2Obj(detailJson, data, 2, function (boj) {
            var prod_entity = new Prod_detail({
                url: url,
                price: data[0],
                commentNum: data[1],
                property: boj
            });
            prod_entity.save(function (err) {
                console.log(url);
                console.log(err);
                //errDetailList.push(url);
            });
        });
    } catch (e) {
        console.log("error:" + e);
        cb(e);
    }
}

function addComment2Mongo(url, data, cb) {
    console.log("评论条数" + data.length);
    data.forEach(function (comm) {
        try {
            if (comm) {
                comm = comm.split('|');
                var comm_Entity = new comment_detail({
                    url: url,
                    commentTime: comm[0],
                    commentText: comm[1],
                    reviewsText: comm[2]
                });
                comm_Entity.save(function (err) {
                    console.log(err);
                    //errCommentList.push(url);
                });
            }
        } catch (e) {
            console.log("出错评论：" + comm);
            console.log("error:" + e);
            cb(e);
        }


    });
}

function handleErrCommUrl(errorList) {
    console.log("comm错误待处理URL长度为：" + errorList.length);
    if(errorList.length>10){
        errorList.forEach(function (e) {
            nodegrass.get(IP + ":" + "3700/?url=" + e, function (html, status, header) {
                errorList.pop(e);
                if (!status) {
                    errorList.push(e);
                    //先将errorList pop出来，防止重复访问，失败以后再重新加入errorList
                } else {
                    addComment2Mongo(e, html, function (err) {
                        if (err) {
                            errorList.push(e);
                        }
                    })
                }
            });
        });
    }
};

function handleErrDetailUrl(errorList) {
    console.log("detail错误待处理URL长度为：" + errorList.length);
    if (errorList.length > 10) {
        errorList.forEach(function (e) {
            nodegrass.get(IP + ":" + "3600/?url=" + e, function (html, status, header) {
                errorList.pop(e);
                if (!status) {
                    errorList.push(e);
                    //先将errorList pop出来，防止重复访问，失败以后再重新加入errorList
                } else {
                    addDetail2Mongo(e, html, function (err) {
                        if (err) {
                            errorList.push(e);
                        }
                    })
                }
            });
        });
    }
};

function list2Obj(obj, list, index, cb) {
    if (list[index + 1] == undefined) {
        cb(obj);
    } else {
        list[index] = list[index].toString().replace(new RegExp(/\./g), '点');
        obj[list[index]] = list[index + 1];
        index++;
        index++;
        list2Obj(obj, list, index, cb);
    }
}

setInterval(handleErrCommUrl, 10000, errDetailList);//纠错
setInterval(handleErrDetailUrl, 10000, errDetailList);//纠错
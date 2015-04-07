/**
 * Created by 图公子 on 2015/3/16.
 */

var http = require("http");
var iconv = require('iconv-lite');

var httpmethods={
    get:function(url, callback){
        http.get(url, function(res) {
            console.log("Got response: " + res.statusCode);
            var data = "";
            res.on('data', function (chunk) {
                data += chunk;
            }).on("end", function() {
                callback(data);
            });
        }).on("error", function(err) {
            console.log(err);
        });
    },
    getByFormat:function(format,url, callback){
        iconv.extendNodeEncodings();
        http.get(url, function(res) {
            console.log("Got response: " + res.statusCode);
            var data = "";
            res.on('data', function (chunk) {
                chunk=chunk.toString(format);
                data += chunk;
            }).on("end", function() {
                callback(data);
            });
        }).on("error", function(err) {
            console.log(err);
        });
    },
    post:function(opt,callback){
        var req= http.request(opt,function(res){
            console.log("Got response: " + res.statusCode);
            var data = "";
            res.on('data', function (chunk) {
                data += chunk;
            }).on("end", function () {
                callback(data);
            }).on("error", function (err) {
                console.log(err);
            });
        });
        req.end();
    },
    postByFormat:function(format,opt, callback){
        iconv.extendNodeEncodings();
        var req= http.request(opt,function(res){
            console.log("Got response: " + res.statusCode);
            var data = "";
            res.on('data', function (chunk) {
                chunk=chunk.toString(format);
                data += chunk;
            }).on("end", function () {
                callback(data);
            }).on("error", function (err) {
                console.log(err);
            });
        });
        req.end();
    }
};
module.exports=httpmethods;

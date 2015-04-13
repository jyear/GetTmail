/**
 * Created by 图公子 on 2015/4/7.
 */

var httpmethod=require('./httpmethod');
var cheerio=require('cheerio');
var fs=require('fs');
var url=" http://localhost:4000";
    httpmethod.get(url, function (data) {
        //data=data.split(',');
        console.log(data);
        fs.writeFile("list.txt",data);
    });






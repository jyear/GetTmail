var fs=require('fs');
var cpus = require('os').cpus();


var dd="http://item.gome.com.cn/9129270591-1118220173.html";
var ee="http://item.gome.com.cn/A0004901447-pop8004298657.html";
var d=1;
//console.log(dd.split('/'));
//ee.split('.').forEach(function (e) {
//    console.log(e.split('/'));
//});
console.log(ee.split('.')[3].split('/')[1]);
//console.log(cpus.length);
////被防爬虫时间：15:46
//function add(d){
//    console.log(d++);
//
//}
//setInterval(add,1000,d);
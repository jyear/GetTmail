/**
 * Created by 图公子 on 2015/4/7.
 */

var httpmethod=require('./oldfile/httpmethod'),
    cheerio=require('cheerio'),
    nodegrass = require('nodegrass'),
    fs=require('fs');

var IP=" http://127.0.0.1";
       //var testUrl="http://localhost:3700/?url=http://item.gome.com.cn/9130470453-1119470047.html";
       var seedUrl=IP+":3500";
var errorList=[];
var btime=new Date();
console.log(btime);

nodegrass.get(seedUrl, function (data,status,header) {

    var countNum=1;
    var dataList=data.split(',');
    console.log(dataList.length);
    dataList.forEach(function (e) {
       //console.log(e);
        if(e==""||e==undefined){
            return;
        }
        nodegrass.get(IP+":"+"3600/?url="+e, function (html,status,header) {
            if(!status){
                errorList.pop(e);
            }else{
                fs.writeFile('./data/'+e.split('.')[3].split('/')[1]+'.html',html);
            }
        });
        //nodegrass.get(IP+":"+"3700/?url="+e, function (html) {
        //    //fs.writeFile(countNum+".html",html);
        //    countNum++;
        //});

    });
    //dealAnObj(1,dataList,0);
});

function handleErrorUrl(errorList){
    if(errorList.length>10){
        errorList.forEach(function (e) {
            nodegrass.get(IP+":"+"3600/?url="+e, function (html,status,header) {
                if(status){
                    errorList.pop(e);
                }
            });
        });
    }
};
setInterval(handleErrorUrl,10000,errorList);
function dealAnObj(index,dataList,porty){
    if(index>dataList.length){
        console.log("END");
    }else if(dataList[index]==""||undefined){
        index++;
        dealAnObj(index,dataList,porty);
    }else{
        var  port=porty%10;
        console.log(dataList[index]);
        nodegrass.get(IP+":"+"360"+port+"/?url="+dataList[index].toString(), function (data,status,header) {
            fs.writeFile(index+'.html',data, function (err) {
                if(err){
                    console.log(err);
                }
                index++;
                porty++;
                dealAnObj(index,dataList,porty);
            });
        });
    }



}
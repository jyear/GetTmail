/**
 * Created by 图公子 on 2015/4/7.
 */

var httpmethod=require('./httpmethod');

var url=" http://localhost:3000";
for(var i=0;i<60;i++){
    httpmethod.get(url, function (data) {
        console.log(data);
    });
}


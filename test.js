var nodegrass = require('nodegrass');

var url = 'http://item.gome.com.cn/9133421143-1122260094.html';
nodegrass.get('http://127.0.0.1:3600/?url=http://item.gome.com.cn/9133421143-1122260094.html', function (data, status, header) {
    console.log(data);
});
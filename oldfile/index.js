/**
 * Created by 图公子 on 2015/3/16.
 */

var httpmethod=require("./httpmethod");
var cheerio = require("cheerio");

var url_part5="/item.htm?spm=a220m.1000858.1000725.1.SZMGn5&id=39569582336&skuId=71033428120&areaId=510000&cat_id=50918004&rn=59a1c816589fe4df5a28bc2e83db042f&standard=1&user_id=1641036859&is_b=1";
var url_part4="/item.htm?spm=a220m.1000858.1000725.12.mgx5Vc&id=35092800260&skuId=49768536711&areaId=510000&cat_id=50918004&rn=0e1618b403eb6d56b22e912641cf30ab&standard=1&user_id=1014281128&is_b=1#J_Reviews";
var url_part3="/item.htm?spm=a220m.1000858.1000725.5.klNISt&id=17139695366&skuId=4611686035567083270&areaId=510000&cat_id=50026502&rn=462bb8f8fb363484cc154e18b544a593&user_id=379424083&is_b=1";
var url_part2="/item.htm?spm=a220m.1000858.1000725.238.0sK5fW&id=39593308512&skuId=54205449631&areaId=510100&cat_id=50930001&rn=4f61e001f20211f0d3007ab36df1a82e&standard=1&user_id=755558609&is_b=1";
var url_part1="/item.htm?spm=a220m.1000858.1000725.61.WyC8bd&id=43123044513&skuId=74377622042&areaId=510100&cat_id=2&rn=c6a688b20391efd0280c33cfe0e56e8d&user_id=786928508&is_b=1#description";
var url_1="http://detail.tmall.com/item.htm?spm=a220m.1000858.1000725.61.WyC8bd&id=43123044513&skuId=74377622042&areaId=510100&cat_id=2&rn=c6a688b20391efd0280c33cfe0e56e8d&user_id=786928508&is_b=1";

var opt = {
    host:'detail.tmall.com',
    port:'80',
    method:'GET',
    path:url_part5,
    headers:{
        //'Accept':	'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        //'Accept-Encoding':	'gzip, deflate, sdch',
        'Accept-Language':	'zh-cn,zh;q=0.8',
        'Cache-Control':	'max-age=0',
        'Connection':	'keep-alive',
        'DNT':	1,
        'Cookie':	'cna=CMrkC8nOyxcCAavYsm2BVRfe; isg=DA057082247554558F10B6C7C4913C9E; cookie2=1e659528e7562dbaf78ed2e16ceff63d; t=1b93be78f64f02efac53a692afc45c25; _tb_token_=eu9mOc5QoczG; pnm_cku822=028UW5TcyMNYQwiAiwTR3tCf0J%2FQnhEcUpkMmQ%3D%7CUm5Ockt0T3ZMc0p%2BRn1CdiA%3D%7CU2xMHDJ%2BH2QJZwBxX39Rb1R6WnQoSS9DJFogDlgO%7CVGhXd1llXGNYYVtkXWlRalVhVmtJd0xzS3dJfEZyTnpBeUF7QXlXAQ%3D%3D%7CVWldfS0RMQQ7BSUZJQUrCzQUKw5YCGoILAcpfyk%3D%7CVmhIGCIfPQQ5BDkEOAA%2FBzIIPQkpFDQIMAw4GCYdIhc3CzMNNhYjGCEBPQU7ACAVKhFHEQ%3D%3D%7CV25Tbk5zU2xMcEl1VWtTaUlwJg%3D%3D; cq=ccp%3D1; CNZZDATA1000279581=1225833952-1426467208-http%253A%252F%252Flist.tmall.com%252F%7C1426467208',
        //'Host':	'detail.tmall.com',
        //'Referer':	'http://list.tmall.com/search_product.htm?q=%CE%D2%B5%C4%CA%C0%BD%E7&type=p&spm=a220m.1000858.a2227oh.d100&from=.list.pc_1_searchbutton',
        'User-Agent':	'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
    }
};

function getPic(){
    httpmethod.postByFormat("gbk",opt, function (data) {

        //找出动态加载图片所用链接
        var reg=/"descUrl":".*?"/img;
        var tem=reg.exec(data)[0].split("\":\"")[1].toString();
        var dscUrl=tem.substring(0,tem.length-1);

        console.log(dscUrl);//肉眼观察取出来的链接

        //通过链接爬取描述
        httpmethod.getByFormat("GBK",dscUrl,function(data){
            var picSrcList=[];//大部分的天猫详情描述都是以图片格式保存，所以爬去图片地址保存在列表中
            var $ = cheerio.load(data);
            $('img').each(function(){
                var reg=/http:.*gif/;

                //排除gif动图 大部分没什么用，剩下的图片地址为详情描述
                if(!reg.test($(this).attr("src"))){
                    picSrcList.push($(this).attr("src"));
                }

            });
            console.log(picSrcList);//目测一哈
        });
    });
}
//getPic();

function J_Attrs(){
    httpmethod.postByFormat("gbk",opt,function(data){
        var $=cheerio.load(data);
        //console.log(data);
        var ddd=$("table[class='tm-tableAttr']").find("tr")[20];//20和之前都为规格参数
        //此处有bug，有的children会报无父节点，如url_part1
        console.log(ddd.children[0].children[0].data.toString().trim());//这个为参数名称
        console.log(ddd.children[1].children[0].data.toString().trim());//这个为参数值

       /*后来发现参数些不是动态生成，先放置之
       *
       * 待续……
       *
       * */

    });
}
//J_Attrs();

function getRate(){
    var ajexUrl="";
    httpmethod.postByFormat("gbk",opt, function (data) {

        console.log(data);
        //发现关于评价,详情展示等的东西还是在tshop这个函数里面 不过它将访问地址与参数分开放置

        //正则出需要的参数
        var teg=/Setup\(\r\n.*\r\n.*\)/mg;
        var temstring=teg.exec(data).toString();
        var temJsonStr=temstring.substring(6,temstring.length-1).trim();

        //处理完参数，是形如{"xx":ddd}的一个json表达式
        var temjson= JSON.parse(temJsonStr);

        //拼接出评论的ajex网址，再爬一次得到数据
        ajexUrl= temjson.url.rate+"/list_detail_rate.htm"+"?itemId="+temjson.rateConfig.itemId+
        "&spuId="+temjson.rateConfig.spuId+
        "&sellerId="+temjson.rateConfig.sellerId+
        "&order="+"1"+
        "&currentPage=100000"+
        "&append=0"+
        "&content=1";
        //"&tagId="+
        //"&posi="+
        //"&picture="+
        //"&ua="+//"003UW5TcyMNYQwiAiwTR3tCf0J%2FQnhEcUpkMmQ%3D%7CUm5Ockt0T3dPdE92SXVIcSc%3D%7CU2xMHDJ%2BH2QJZwBxX39Rb1R6WnQoSS9DJFogDlgO%7CVGhXd1llXGNYYFhjWGFeYl9mUWxOc0pzR3hDe0VxSndJfEJ5RHFfCQ%3D%3D%7CVWldfS0QMA87ACAcJQUrCjUQYh10DyNCM0opGWhGEEY%3D%7CVmhIGCIfPQQ5BDkEOAA%2FBzIIPQkpFDQIMAw4GCYcKRw8ADgGPR0oEyoKNg4wCyseIRpMGg%3D%3D%7CV29PHzFaPVsmSy1Qfl4OMg86GiMZInRUaUlnSWlXY1gOWA%3D%3D%7CWGFBET8RMQ02DCwZJRg4Bj8HP2k%2F%7CWWFBET9GIks7Vi1oAmANZhs1FUV6RnlZY15kMhIvDyEPLxcjGCx6LA%3D%3D%7CWmJCEjxXMFYrRiBdc1MDPwM8HCYZJHJSb09hT29Ub1ZjNWM%3D%7CW2JCEjxXMFYrRiBdc1NvU2hIck50VG5TaV0LXQ%3D%3D%7CXGREFDpRNlAtQCZbdVUFOQc4GCMXLnhYZUVrRWVfYVtjNWM%3D%7CXWZGFjgWNgg9HSAANQwyCV8J%7CXmVFFTsVNQs%2BHiMDNgI8A1UD%7CX2REFDoUNAo%2FHyICNwM7D1kP%7CQHtbCyULKxUgAD0dKBwoE0UT%7CQXpaCiQKKhQhATwcKBUqEkQS%7CQnlZCScJKRciAj8fKxYvFkAW%7CQ3hYCCYIKBYjAz4eKhcsGU8Z%7CRH9fDyEPLxEkBDkZLREvFEIU%7CRX5eDiAOLhAlBTgYLBAoFkAW%7CRn5eDiBLLEo3WjxBb08fIx0mBjgGO21NcFB%2BUHBMc012SB5I%7CR3xcDCIMLBUoCDUVKRcsESt9Kw%3D%3D%7CSHFRAS9WMlsrRj14EnAddgslBTsGMxMtFSAAPgQ%2BATVjNQ%3D%3D%7CSXBQAC4AIBgmEjINMAsrFSAcKBRCFA%3D%3D%7CSnNTAy0DIxsuFTUJPAkpFyIZLRhOGA%3D%3D%7CS3JSAiwCIhknGDgEOQU9HSQYIR8rfSs%3D%7CTHRUBCoEJHRPcU5uUm9TbjgYJQUrBSUcIBshGU8Z%7CTXRJdFRpSXZWalNvT3FJc1NqSnZCYlZ2SnBQbFd3TGxQaUl2T29Qbk5xTm5RbU1yT29TZ0d7Tm5SaEh0T29WdkpzU3JIaEl8XH1JaUh0SWlIdyE%3D"+
        //"&_ksTS="+//+"1426556684488_1602"+
        //"&callback=";//+"jsonp1603";
        console.log(ajexUrl.toString());
        httpmethod.getByFormat("gbk",ajexUrl,function(data2){
            console.log(data2);
        });
    });
}
getRate();

function getInitData(){
    var ajexUrl="";
    httpmethod.postByFormat("gbk",opt, function (data) {
        //发现关于评价,详情展示等的东西还是在tshop这个函数里面 不过它将访问地址与参数分开放置

        //正则出需要的参数
        var teg=/Setup\(\r\n.*\r\n.*\)/mg;
        var temstring=teg.exec(data).toString();
        var temJsonStr=temstring.substring(6,temstring.length-1).trim();

        //处理完参数，是形如{"xx":ddd}的一个json表达式
        var temjson= JSON.parse(temJsonStr);
        //console.log(temjson);
       //从temjson中取出需要的初始化用网址
        var ajexUrl=temjson.initApi.toString();
        var path=ajexUrl.substring(24);
        console.log(path.toString());
        var optForInit = {
            host:'mdskip.tmall.com',
            port:'80',
            method:'GET',
            path:path,
            headers:{
                //'Accept':	'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                //'Accept-Encoding':	'gzip, deflate, sdch',
                'Accept-Language':	'zh-cn,zh;q=0.8',
                'Cache-Control':	'max-age=0',
                'Connection':	'keep-alive',
                'DNT':	1,
                'Referer': 'http://detail.tmall.com/item.htm?spm=a220m.1000858.1000725.12.mgx5Vc&id=35092800260&skuId=49768536711&areaId=510000&cat_id=50918004&rn=0e1618b403eb6d56b22e912641cf30ab&standard=1&user_id=1014281128&is_b=1',
                'Cookie':	'cna=CMrkC8nOyxcCAavYsm2BVRfe; isg=DA057082247554558F10B6C7C4913C9E; cookie2=1e659528e7562dbaf78ed2e16ceff63d; t=1b93be78f64f02efac53a692afc45c25; _tb_token_=eu9mOc5QoczG; pnm_cku822=028UW5TcyMNYQwiAiwTR3tCf0J%2FQnhEcUpkMmQ%3D%7CUm5Ockt0T3ZMc0p%2BRn1CdiA%3D%7CU2xMHDJ%2BH2QJZwBxX39Rb1R6WnQoSS9DJFogDlgO%7CVGhXd1llXGNYYVtkXWlRalVhVmtJd0xzS3dJfEZyTnpBeUF7QXlXAQ%3D%3D%7CVWldfS0RMQQ7BSUZJQUrCzQUKw5YCGoILAcpfyk%3D%7CVmhIGCIfPQQ5BDkEOAA%2FBzIIPQkpFDQIMAw4GCYdIhc3CzMNNhYjGCEBPQU7ACAVKhFHEQ%3D%3D%7CV25Tbk5zU2xMcEl1VWtTaUlwJg%3D%3D; cq=ccp%3D1; CNZZDATA1000279581=1225833952-1426467208-http%253A%252F%252Flist.tmall.com%252F%7C1426467208',
                'User-Agent':	'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
            }
        };
        httpmethod.postByFormat("gbk",optForInit,function(data2){
            console.log(data2);
            //获取的数据貌似有问题，无法json化，先这么放着吧
            //var datajson=JSON.parse(data2);
            //console.log(datajson);

        });

    });
}
//getInitData();

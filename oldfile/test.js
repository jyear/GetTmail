/**
 * Created by 图公子 on 2015/3/17.
 */

var httpmethod=require("./httpmethod");
var cheerio = require("cheerio");

var url_part="/item.htm?spm=a220m.1000858.1000725.12.mgx5Vc&id=35092800260&skuId=49768536711&areaId=510000&cat_id=50918004&rn=0e1618b403eb6d56b22e912641cf30ab&standard=1&user_id=1014281128&is_b=1#J_Reviews";
var url_part_init="/core/initItemDetail.htm?sellerUserTag=39391266&isApparel=false&isAreaSell=true&isRegionLevel=true&sellerUserTag3=432978882927296640&sellerUserTag4=8800423658883&tryBeforeBuy=false&isUseInventoryCenter=true&progressiveSupport=true&notAllowOriginPrice=false&addressLevel=3&sellerUserTag2=18020085046181888&service3C=true&itemTags=775,907,1035,1163,1227,1478,1675,1735,1867,1923,1927,2049,2059,2114,2178,2187,2242,2315,2507,2562,2635,3339,3974,4166,4614,4678,4811,4865,5323,5451,6146,6785,7809,9025,9153,11265,12033,12353,12609,13697,15554,16321,16513,16961,17537,17665,17793,18945,19841,20161,20289,20481,21121,21442,21697,21761,21762,21826,22081,22273,23746,25026,25282,25922,28674,28802,40898,56130,56194,59650&isIFC=false&cartEnable=true&tmallBuySupport=true&itemId=35092800260&showShopProm=false&isForbidBuyItem=false&offlineShop=false&tgTag=false&household=false&sellerPreview=false&queryMemberRight=true&isSecKill=false&callback=setMdskip&timestamp=1426572306068&areaId=510000&cat_id=50918004";

var opt1 = {
   host:'detail.tmall.com',
   port:'80',
   method:'GET',
   path:url_part,
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

var opt2 = {
   host:'mdskip.tmall.com',
   port:'80',
   method:'GET',
   //Referer:	'http://list.tmall.com/search_product.htm?q=%CE%D2%B5%C4%CA%C0%BD%E7&type=p&spm=a220m.1000858.a2227oh.d100&from=.list.pc_1_searchbutton',
   path:url_part_init,
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

httpmethod.postByFormat("gbk",opt2,function(data){
   console.log(data);
});
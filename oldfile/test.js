var page = require('webpage').create();

// Open Twitter on 'sencha' profile and, onPageLoad, do...

//
var testurl="http://detail.tmall.com/item.htm?spm=a220m.1000858.1000725.9.hLC38S&id=19842770800&skuId=31668477891&areaId=621200&cat_id=2&rn=5ee7cf53112db3113c042a183c048fdf&standard=1&user_id=470168984&is_b=1";

var testu="http://www.cnblogs.com/yuzhongwusan/p/4184923.html";


page.open(testurl, function (status) {
   // Check for page load success
   if (status !== "success") {
      console.log("Unable to access network");
      phantom.exit(1);
   }
   console.log(page.injectJs("jquery-1.8.0.min.js") ? "... done injecting itself!" : "... fail! Check the $PWD?!");
   page.scrollPosition = {
      top: 100,
      left: 1700
   };
   page.render('yy.png');
   // jQuery is loaded, now manipulate the DOM
   //   console.log("include !");
      // Wait for 'signin-dropdown' to be visible
      waitFor(function() {
         // Check in the page if a specific element is now visible
         return page.evaluate(function() {
            return $("a[href='#J_Reviews']").is(":visible");
            //return $("#content").is(":visible");
         });
      }, function() {
         console.log("suit out!");
         page.render('./yy.png');
         //phantom.exit();
      });
});







function waitFor(testFx, onReady, timeOutMillis) {
   var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
       start = new Date().getTime(),
       condition = false,
       interval = setInterval(function() {
          if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
             // If not time-out yet and condition not yet fulfilled
             condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
          } else {
             if(!condition) {
                // If condition still not fulfilled (timeout but condition is 'false')
                console.log("'waitFor()' timeout");
                phantom.exit(1);
             } else {
                // Condition fulfilled (timeout and/or condition is 'true')
                console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                clearInterval(interval); //< Stop this interval
             }
          }
       }, 250); //< repeat check every 250ms
};

page.onConsoleMessage = function(msg, lineNum, sourceId) {
   console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};

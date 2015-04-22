var nodegrass = require('nodegrass');

var comm = require('./mongo/comment_detail');
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/gome_cw');
var ddd = new comm({
    url: "dddd"
});
ddd.save(function (err) {
    console.log(err);
});
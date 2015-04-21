/**
 * Created by 图公子 on 2015/4/21.
 */

//var db = mongoose.connect("mongodb://127.0.0.1:27017/gome_cw");
var mongoose = require("mongoose");
var commentSchema = new mongoose.Schema({

    url: {type: String, default: {}},
    commentText: {type: String, default: ""},
    updateTime: {type: Date, default: Date.now}
});

var commentModel = mongoose.model("comment_detail", commentSchema);


//test

module.exports = commentModel;
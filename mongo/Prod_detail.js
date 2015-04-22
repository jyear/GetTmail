/**
 * Created by 图公子 on 2015/4/21.
 */
//var mongoose = require("mongoose");
//mongoose.connect('mongodb://localhost/gome_cw');
//var db = mongoose.connect("mongodb://127.0.0.1:27017/gome_cw");
var mongoose = require("mongoose");
var ProdSchema = new mongoose.Schema({

    url: {type: String, default: {}},
    price: {type: String, default: ""},
    commentNum: {type: String, default: ""},
    property: {type: {}, default: {}},
    updateTime: {type: Date, default: Date.now}
});

var ProdModel = mongoose.model("product_detail", ProdSchema);


//test

module.exports = ProdModel;
var ReactiveVis = require("./reactive-vis.js");
var ReactiveModel = require("reactive-model");
var jsdom = require("jsdom");
var d3 = require("d3-selection");
var assert = require("assert");


//import { SVG, Margin } from "./index.js";
//import ReactiveModel from "reactive-model";
//import jsdom from "jsdom";
//import assert from "assert";
//import select from "d3-selection";

function createSVG(){
  return d3.select(jsdom.jsdom().body).append("svg");
}

describe("ReactiveVis", function(){
  describe("SVG", function(){
    it("Should set width and height", function(){
      var my = new ReactiveModel()
        .call(ReactiveVis.SVG)
        .svg(createSVG());

      ReactiveModel.digest();
      assert(my.svg().attr("width", 960));
      assert(my.svg().attr("height", 500));

      my.width(100).height(200);

      ReactiveModel.digest();
      assert(my.svg().attr("width", 100));
      assert(my.svg().attr("height", 200));
    });
  });

  describe("Margin", function(){
    it("Should compute innerWidth and innerHeight", function(){
      var my = new ReactiveModel()
        .call(ReactiveVis.SVG)
        .call(ReactiveVis.Margin)
        .svg(createSVG());

      ReactiveModel.digest();
      assert(my.innerWidth(), my.width() - my.width() - my.marginLeft() - my.marginRight());
      assert(my.innerHeight(), my.height() - my.marginTop() - my.marginBottom());

      my
        .width(100)
        .height(200)
        .marginTop(10)
        .marginBottom(11)
        .marginLeft(12)
        .marginRight(13)

      ReactiveModel.digest();
      assert(my.innerWidth(), my.width() - my.width() - my.marginLeft() - my.marginRight());
      assert(my.innerHeight(), my.height() - my.marginTop() - my.marginBottom());
    });

    it("Should append g to svg", function(){
      var my = new ReactiveModel()
        .call(ReactiveVis.SVG)
        .call(ReactiveVis.Margin)
        .svg(createSVG());

      ReactiveModel.digest();
      assert.equal(my.g().node().tagName, "g");
      assert(my.innerHeight(), my.height() - my.marginTop() - my.marginBottom());

      my
        .width(100)
        .height(200)
        .marginTop(10)
        .marginBottom(11)
        .marginLeft(12)
        .marginRight(13)

      ReactiveModel.digest();
      assert(my.innerWidth(), my.width() - my.width() - my.marginLeft() - my.marginRight());
      assert(my.innerHeight(), my.height() - my.marginTop() - my.marginBottom());
    });

    it("Should set g transform", function(){
      var my = new ReactiveModel()
        .call(ReactiveVis.SVG)
        .call(ReactiveVis.Margin)
        .svg(createSVG());

      ReactiveModel.digest();
      assert.equal(my.g().attr("transform"), "translate(50,50)");

      my.marginTop(10).marginLeft(12);

      ReactiveModel.digest();
      assert.equal(my.g().attr("transform"), "translate(12,10)");
    });
  });
});

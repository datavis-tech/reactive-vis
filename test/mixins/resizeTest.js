var ReactiveVis = require("../../build/reactive-vis.js");
var assert = require("assert");
var jsdom = require("jsdom");
var d3 = require("d3-selection");

module.exports = function (common){
  var createSVG = common.createSVG;
  describe("Resize", function(){

    it("Should set width and height from clientWidth and clientHeight", function(){

      var container = d3.select(jsdom.jsdom().body)
        .append("div")
        .node();

      container.clientWidth = 234;
      container.clientHeight = 567;

      var my = ReactiveVis.Model()
        .call(ReactiveVis.SVG)
        .call(ReactiveVis.Resize, container);

      assert.equal(my.width(), container.clientWidth);
      assert.equal(my.height(), container.clientHeight);

      my.destroy();
    });
  });
};

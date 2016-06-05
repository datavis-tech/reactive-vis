var ReactiveVis = require("../../build/reactive-vis.js");
var assert = require("assert");

module.exports = function (common){
  var output = common.output;

  describe("Column", function(){
    it("Should create a column property with name prefix.", function(){
      var my = ReactiveVis.Model()
        .call(ReactiveVis.Data)
        .call(ReactiveVis.Column, "x");

      my.xColumn("foo");
      assert.equal(my.xColumn(), "foo");
      
      output("column");
      my.destroy();
    });
  });
};

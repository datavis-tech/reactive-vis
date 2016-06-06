var ReactiveVis = require("../../build/reactive-vis.js");
var assert = require("assert");

module.exports = function (common){
  var output = common.output;

  describe("Scale", function(){

    it("Should create a scale property with name prefix.", function(){
      var my = ReactiveVis.Model()
        .call(ReactiveVis.Data)
        .call(ReactiveVis.Column, "x")

        ("xDomain", [5, 10])
        ("xRange", [0, 100])
        .call(ReactiveVis.Scale, "x")

      ReactiveVis.digest();

      assert.equal(typeof my.xScale(), "function");
      assert.equal(my.xScale()(7), 40);
      
      my.destroy();
    });

    //it("Should create an accessor property with name prefix.", function(){
    //  var my = ReactiveVis.Model()
    //    .call(ReactiveVis.Data)
    //    .call(ReactiveVis.Column, "x");

    //  my.xColumn("foo");
    //  ReactiveVis.digest();
    //  assert.equal(my.xAccessor()({ foo: "bar" }), "bar");
    //  
    //  my.destroy();
    //});
    //
    //    .call(ReactiveVis.Scale, "x", {
    //      type: "Linear",
    //      nice: true
    //    });
  });
};

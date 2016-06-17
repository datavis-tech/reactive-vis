var ReactiveVis = require("../../build/reactive-vis.js");
var assert = require("assert");
var d3 = require("d3-scale");

module.exports = function (common){
  var output = common.output;

  describe("Scale", function(){

    it("Should create a property with name prefix.", function(){
      var my = ReactiveVis.Model()
        .call(ReactiveVis.Data)
        .call(ReactiveVis.Column, "x")

        ("xDomain", [5, 10])
        ("xRange", [0, 100])
        .call(ReactiveVis.Scale, "x", d3.scaleLinear)

      ReactiveVis.digest();
     
      assert.equal(typeof my.xScale(), "function");
      assert.equal(my.xScale()(7), 40);
      
      my.destroy();
    });

    it("Should create a (name + \"Scaled\") property.", function(){
      var my = ReactiveVis.Model()
        .call(ReactiveVis.Data)
        .call(ReactiveVis.Column, "x")

        ("xDomain", [5, 10])
        ("xRange", [0, 100])
        .call(ReactiveVis.Scale, "x", d3.scaleLinear)

      my.xColumn("foo");

      ReactiveVis.digest();
     
      assert.equal(typeof my.xScaled(), "function");
      assert.equal(my.xScaled()({ foo: 7 }), 40);
      
      my.destroy();
    });

    it("Should support sqrt scale.", function(){
      var my = ReactiveVis.Model()
        .call(ReactiveVis.Data)
        .call(ReactiveVis.Column, "x")

        ("xDomain", [0, 16])
        ("xRange", [0, 256])
        .call(ReactiveVis.Scale, "x", d3.scaleSqrt);

      my.xColumn("foo");

      ReactiveVis.digest();
     
      assert.equal(typeof my.xScale(), "function");
      assert.equal(my.xScale()(4), 128);
      assert.equal(my.xScaled()({ foo: 4 }), 128);
      
      my.destroy();
    });

  });
};

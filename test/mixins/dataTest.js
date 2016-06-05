var ReactiveVis = require("../../build/reactive-vis.js");
var assert = require("assert");

module.exports = function (common){
  var output = common.output;

  describe("Data", function(){
    it("Should create a property called 'data'", function(){
      var my = ReactiveVis.Model()
        .call(ReactiveVis.Data);

      my.data([1, 2, 3]);
      assert.deepEqual(my.data(), [1, 2, 3]);
      
      output("data");
      my.destroy();
    });
  });
};

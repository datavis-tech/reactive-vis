var ReactiveVis = require("./reactive-vis.js");
var ReactiveModel = require("reactive-model");
var jsdom = require("jsdom");
var d3 = require("d3-selection");
var assert = require("assert");

function createContainer(){
  var document = jsdom.jsdom();
  return d3.select(document.body).append("div").node();
}

describe("ReactiveVis", function(){
  it("svg", function(){
    var model = new ReactiveModel();
    ReactiveVis(model).svg();
    model.container(createContainer());
    ReactiveModel.digest();
    assert.equal(model.svg().node().tagName, "svg")
  });
});

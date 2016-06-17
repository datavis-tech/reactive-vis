import ReactiveModel from "reactive-model";
import SVG from "../mixins/svg";
import Data from "../mixins/data";
import Margin from "../mixins/margin";
import Column from "../mixins/column";
import Scale from "../mixins/scale";

import { extent, max } from "d3-array";
import { scaleLinear, scaleSqrt } from "d3-scale";

// TODO use local from d3-selection when it is released.
//import { local } from "d3-selection";

// Temporary measure:
var local = (function() {
  var nextKey = 0;

  function local() {
    return new Local;
  }

  function Local() {
    this._id = "@" + (++nextKey).toString(36);
  }

  Local.prototype = local.prototype = {
    constructor: Local,
    get: function(node) {
      var id = this._id;
      while (!(id in node)) if (!(node = node.parentNode)) return;
      return node[id];
    },
    set: function(node, value) {
      return node[this._id] = value;
    },
    remove: function(node) {
      return this._id in node && delete node[this._id];
    },
    toString: function() {
      return this._id;
    }
  };

  return local;
})();

export default function Circle(){
  return ReactiveModel()
    .call(SVG)
    .call(Margin)
    .call(Data)

    .call(Column, "x")
    .call(Column, "y")
    .call(Column, "size")

    // The x scale.
    ("xDomain", function (data, accessor){
      return extent(data, accessor);
    }, "data, xAccessor")
    ("xRange", function (innerWidth){
      return [0, innerWidth];
    }, "innerWidth")
    .call(Scale, "x", scaleLinear)

    // The y scale.
    ("yDomain", function (data, accessor){
      return extent(data, accessor);
    }, "data, yAccessor")
    ("yRange", function (innerHeight){
      return [innerHeight, 0];
    }, "innerHeight")
    .call(Scale, "y", scaleLinear)

    // The size scale.
    ("sizeMax", 20)
    ("sizeDomain", function (data, accessor){
      return [0, max(data, accessor)];
    }, "data, sizeAccessor")
    ("sizeRange", function (sizeMax){
      return [0, sizeMax];
    }, "sizeMax")
    .call(Scale, "size", scaleSqrt)

    // This is the single SVG group for the scatter layer.
    ("scatterLayer", function (g){

      var scatterLayer = g.selectAll(".reactive-vis-scatter-layer")
        .data([1]);

      return scatterLayer.enter().append("g")
          .attr("class", "reactive-vis-scatter-layer")
        .merge(scatterLayer);

    }, "g")

    // This is the selection of many g elements, corresponding to the data.
    ("marks", function (scatterLayer, data, xScaled, yScaled, sizeScaled){

      var scatter = scatterLayer.selectAll(".reactive-vis-scatter-mark")
        .data(data);

      scatter.exit().remove();

      var sizeLocal = local();

      var marks = scatter.enter().append("g")
          .attr("class", "reactive-vis-scatter-mark")
        .merge(scatter)
          .attr("transform", function (d){
            return "translate(" + xScaled(d) + "," + yScaled(d) + ")";
          })
          .each(function(d) {
            sizeLocal.set(this, sizeScaled(d));
          });

      marks.sizeLocal = sizeLocal;

      return marks;
    }, "scatterLayer, data, xScaled, yScaled, sizeScaled");
}

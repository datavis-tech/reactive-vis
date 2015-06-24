import ReactiveModel from "reactive-model";
import { select } from "d3-selection";

var methods = {
  svg: ["container", function (container){
    return select(container).append("svg");
  }]
};

function pick(method){
  var options = {};
  options[method] = methods[method]
  return options;
}

function ReactiveVis(model){
  var chainable = {};
  Object.keys(methods).forEach(function (method){
    chainable[method] = function(){
      model.react(pick(method));
      return chainable;
    };
  });
  return chainable;
}

export default ReactiveVis;

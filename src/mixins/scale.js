import { scaleLinear } from "d3-scale";

var scaleConstructors = {
  linear: scaleLinear
  // TODO support all scales https://github.com/datavis-tech/reactive-vis/issues/26
};


export default function Scale (my, name, options){

  options = options || {};
  var type = options.type || "linear";

  var scale = scaleConstructors[type]();

  my

    (name + "Scale", function(domain, range){
      return scale.domain(domain).range(range);
    }, [name + "Domain", name + "Range"])

    (name + "Scaled", function(scale, accessor){
      return function (d){
        return scale(accessor(d));
      };
    }, [name + "Scale", name + "Accessor"]);
}

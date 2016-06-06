import { scaleLinear } from "d3-scale";

var scaleConstructors = {
  linear: scaleLinear
};

export default function Scale (my, name, options){

  options = options || {};
  var type = options.type || "linear";
  var nice = options.nice || true;

  var scale = scaleConstructors[type]();


  // (name + "Domain") and (name + "Range")
  // must be defined on the model before incoking this mixin.
  // TODO throw an error if they are not defined at this point.
  // GitHub issue #25 https://github.com/datavis-tech/reactive-vis/issues/25

  my

    (name + "Scale", function(domain, range){

      scale
        .domain(domain)
        .range(range);

      // TODO test
      //if(nice){
      //  scale.nice();
      //}

      return scale;
    }, [name + "Domain", name + "Range"])

    (name + "Scaled", function(scale, accessor){
      return function (d){
        return scale(accessor(d));
      };
    }, [name + "Scale", name + "Accessor"]);
}

export default function Scale (my, name, scaleConstructor){

  var scale = scaleConstructor();

  my
  
    (name + "Scale", function(domain, range){
      return scale
        .domain(domain)
        .range(range);
    }, [name + "Domain", name + "Range"])

    (name + "Scaled", function(scale, accessor){
      return function (d){
        return scale(accessor(d));
      };
    }, [name + "Scale", name + "Accessor"])

}

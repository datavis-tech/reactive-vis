export default function Column (my, name){
  my(name + "Column")
    (name + "Accessor", function (column){
      return function (d){ return d[column]; };
    }, name + "Column");
}

export function column (my, name){

  my

    (name + "Column")

    (name + "Accessor", function (column){
      return function (d){
        return d[column];
      };
    }, name + "Column");

}

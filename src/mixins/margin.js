export function margin(my){

  my
  
    ("marginTop",    50)
    ("marginBottom", 50)
    ("marginLeft",   50)
    ("marginRight",  50)

    ("innerWidth", function (width, marginLeft, marginRight){
      return width - marginLeft - marginRight;
    }, "width, marginLeft, marginRight")

    ("innerHeight", function (height, marginTop, marginBottom){
      return height - marginTop - marginBottom;
    }, "height, marginTop, marginBottom")

    ("g", function (svg){
      var g = svg
        .selectAll(".reactive-vis-margin-g")
          .data([1]);
      return g
        .enter()
          .append("g")
          .attr("class", "reactive-vis-margin-g")
        .merge(g);
    }, "svg")

    ("g-transform", function (g, marginLeft, marginTop){
      g.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");
    }, "g, marginLeft, marginTop");

}

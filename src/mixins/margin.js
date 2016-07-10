// Encapsulates the margin convention.
export default function Margin(my){
  my("marginTop", 50)
    ("marginBottom", 50)
    ("marginLeft", 50)
    ("marginRight", 50)

    ("innerWidth", function (width, marginLeft, marginRight){
      return width - marginLeft - marginRight;
    }, "width, marginLeft, marginRight")

    ("innerHeight", function (height, marginTop, marginBottom){
      return height - marginTop - marginBottom;
    }, "height, marginTop, marginBottom")

    ("g", function (svgSelection){

      var g = svgSelection.selectAll(".reactive-vis-margin-g")
        .data([1]);

      return g.enter().append("g")
          .attr("class", "reactive-vis-margin-g")
        .merge(g);

    }, "svgSelection")

    ("g-transform", function (g, marginLeft, marginTop){
      g.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");
    }, "g, marginLeft, marginTop");
}

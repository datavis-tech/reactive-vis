import ReactiveModel from "reactive-model";

// Resizes the SVG container.
export function SVG (my){
  my("svg")
    ("width", 960)
    ("height", 500)
    ("svg-width", function (svg, width){
      svg.attr("width", width);
    }, "svg, width")
    ("svg-height", function (svg, height){
      svg.attr("height", height);
    }, "svg, height");
}

// Encapsulates the margin convention.
export function Margin(my){
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

    ("g", function (svg){
      return svg.append("g");
    }, "svg")

    ("g-transform", function (g, marginLeft, marginTop){
      g.attr("transform", "translate(" + marginLeft + "," + marginTop + ")");
    }, "g, marginLeft, marginTop");
}

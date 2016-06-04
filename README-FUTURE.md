This document is essentially a requirements document that outlines the goals and scope of the project. It is written in such a way that parts of the document can be move into the actual README once they are implemented.

# reactive-vis FUTURE!

This library supports the creation of interactive data visualizations. A layered approach is taken wherein visual components can be built up from smaller ones, and visual components can be composed in various ways.

## Simplifying Assumptions

 * SVG Only (No Canvas, No WebGL)

## Composition

 * Adjacent - Visualizations may be placed next to one another within the same SVG element. The placement should be able to follow a nested box layout.
 * Layered - It should be possible to place a visual component on top of another in a layered manner. Examples:
   * Color legend on top of a stacked bar chart in the upper right corner.
   * Area chart behind a bar chart
 * Nested - Hybrid visualizations in which visual components are nested within other visual components should be trivial to assemble. Examples:
   * Facet (small multiples in X and/or Y)
   * Scatter plot of pie charts
   * Treemap of line charts

## Dynamism

 * Interactions
   * Brushing
     * Quadtree
     * R-Tree
   * Hovering
     * Voronoi Overlay
   * Pan
   * Zoom
 * Linked Views
   * Linked Highlighting
   * Focus + Context
   * Crossfilter
 * Transitions
  * Updates in configuration should manifest as transitions where possible.
  * It should be possible to customize the transitions (e.g. bounce in bars on enter).

# Visual Components

Visual components include both marks and "chart types".

## Foundational Components

 * Circle
 * Rectangle
 * Scatter Plot
 * Bar Chart
   * Stacked
   * Grouped
   * Horizontal variations (Bar Chart, Stacked, Grouped)
 * Pie Chart
 * Line Chart
   * Variant with multiple lines
   * Variant with spline interpolation
 * Area Chart
   * Stacked Area Chart
   * Streamgraph
 * Treemap

## Add-on Components

The following components should be implemented as separate packages that build upon this library.

 * Sankey
 * Chord
 * Parallel Coordinates
 * Choropleth
 * Tree (tidy)
 * Box Plot

## Extensibility

Visual components should be extensible without requiring modification of the original code. Something like inheritance should be possible. The following should be accessible:

 * Visual marks should be accessible for appending additional marks or adding interactions.
   * e.g. adding text labels to each bar in a bar chart
 * Scales should be inspectable.
   * e.g. for using in a color legend

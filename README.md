# reactive-vis
An experiment for building data visualizations.

In this project, it is assumed that a data visualization is represented as an instance of [ReactiveModel](https://github.com/curran/reactive-model). Given this assumption, this library provides reusable data dependency graphs visualizations based on [D3](d3js.org).

Here is a list of property names that have a specific interpretation within this library:

| Property| Description | Type | Example |
|---------|-------------|------|---------|
| width         | The outer width of the visualization.  | Integer (in pixels) | 960 |
| height        | The outer height of the visualization. | Integer (in pixels) | 500 |
| marginTop     | The top margin.                        | Integer (in pixels) | 20  |
| marginBottom  | The bottom margin.                     | Integer (in pixels) | 20  |
| marginRight   | The right margin.                      | Integer (in pixels) | 10  |
| marginLeft    | The left margin.                       | Integer (in pixels) | 10  |
| innerWidth    | The inner width of the visualization.  | Integer (in pixels) | 940 |
| innerHeight   | The inner height of the visualization. | Integer (in pixels) | 460 |
| data          | An array of parsed rows from a table.  | Array of Objects    | `[{x:1}, {x:2}]` |
| dataURL       | A URL from which to load data.         | String (URL)        | http://curran.github.io<br>/data/iris/iris.csv |

An empty cell for default value means that there is no default value, and the value is derived from default values of other properties.

A special default value `NONE` refers to a value that is defined, but represents that the property is optional and has not been speficied (similar conceptually to [Scala's Option Type](http://danielwestheide.com/blog/2012/12/19/the-neophytes-guide-to-scala-part-5-the-option-type.html).

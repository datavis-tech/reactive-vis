import npm from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
  entry: "src/index.js",
  format: "umd",
  moduleName: "ReactiveVis",
  plugins: [
    npm({ jsnext: true }),
    commonjs()
  ],
  dest: "build/reactive-vis.js"
};

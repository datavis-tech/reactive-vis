import ReactiveModel from "reactive-model";
import SVG from "../mixins/svg";
import Data from "../mixins/data";

export default function Circle(){
  return ReactiveModel()
    .call(SVG)
    .call(Data);
}

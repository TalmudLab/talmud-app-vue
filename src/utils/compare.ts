import {daf} from "../state/types";

export function dafEquals(daf1: daf, daf2: daf) {
  return daf1.tractate == daf2.tractate && daf1.daf == daf2.daf;
}
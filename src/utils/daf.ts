import {daf} from "../state/types";
import {currentDaf} from "../state/current";

export function dafEquals(daf1: daf, daf2: daf) {
  return daf1.tractate == daf2.tractate && daf1.daf == daf2.daf;
}

export function surrounding(daf: daf): {prev: daf, next: daf} {
  const nextDaf = {
    tractate: daf.tractate,
    daf: ""
  }
  const prevDaf = {
    tractate: daf.tractate,
    daf: ""
  }
  if (currentDaf.daf.includes('b')) {
    nextDaf.daf = "" + (Number(currentDaf.daf.substring(0, currentDaf.daf.length - 1)) + 1);
  } else {
    nextDaf.daf = currentDaf.daf + "b";
  }

  if (currentDaf.daf.includes('b')) {
    prevDaf.daf = currentDaf.daf.substring(0, currentDaf.daf.length - 1);
  } else {
    prevDaf.daf = "" + (Number(currentDaf.daf) - 1) + "b";
  }

  return {
    prev: prevDaf,
    next: nextDaf
  }
}
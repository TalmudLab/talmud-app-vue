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
  if (daf.daf.includes('b')) {
    nextDaf.daf = "" + (Number(currentDaf.daf.substring(0, daf.daf.length - 1)) + 1);
  } else {
    nextDaf.daf = daf.daf + "b";
  }

  if (daf.daf.includes('b')) {
    prevDaf.daf = daf.daf.substring(0, daf.daf.length - 1);
  } else {
    prevDaf.daf = "" + (Number(daf.daf) - 1) + "b";
  }

  return {
    prev: prevDaf,
    next: nextDaf
  }
}

export function dafsBetween(start: daf, end: daf): Array<daf> {
  debugger;
  if (dafEquals(start, end)) return [];
  const between = [];
  let curr = start;
  while (!dafEquals(curr = surrounding(curr).next, end)) {
    between.push(curr)
  }
  return between;
}
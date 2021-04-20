import {daf} from "../state/types";

export function dafId(tractate: string, daf: string): string {
  return tractate + daf;
}

export function dafEquals(daf1: daf, daf2: daf) {
  return daf1.tractate == daf2.tractate && daf1.daf == daf2.daf;
}

export function surrounding({daf, tractate}: daf): {prev: daf, next: daf} {
  const nextDaf = {
    tractate,
    daf: ""
  }
  const prevDaf = {
    tractate,
    daf: ""
  }
  if (daf.includes('b')) {
    nextDaf.daf = "" + (Number(daf.substring(0, daf.length - 1)) + 1);
  } else {
    nextDaf.daf = daf + "b";
  }

  if (daf.includes('b')) {
    prevDaf.daf = daf.substring(0, daf.length - 1);
  } else {
    prevDaf.daf = "" + (Number(daf) - 1) + "b";
  }

  return {
    prev: prevDaf,
    next: nextDaf
  }
}

export function dafsBetween(start: daf, end: daf): Array<daf> {
  if (dafEquals(start, end)) return [];
  const between = [];
  let curr = start;
  while (!dafEquals(curr = surrounding(curr).next, end)) {
    between.push(curr)
  }
  return between;
}


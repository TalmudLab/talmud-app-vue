import { reactive } from "vue"

type daf = {
  tractate: string,
  daf: string
}

//TODO: only expose get/set, set should have validation
const currentDaf = reactive<daf>({
  tractate: "Berakhot",
  daf: "31b"
});

function next() {
  if (currentDaf.daf.includes('b')) {
    currentDaf.daf = "" + (Number(currentDaf.daf.substring(0, currentDaf.daf.length - 1)) + 1);
  } else {
    currentDaf.daf += "b";
  }
}

function prev() {
    if (currentDaf.daf.includes('b')) {
      currentDaf.daf = currentDaf.daf.substring(0, currentDaf.daf.length - 1);
    } else {
        currentDaf.daf = "" + (Number(currentDaf.daf) - 1) + "b";
    }
}


export { currentDaf, next, prev};

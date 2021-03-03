import { reactive } from "vue"

type daf = {
  tractate: string,
  daf: string
}

//TODO: only expose get/set, set should have validation
const currentDaf = reactive<daf>({
  tractate: "Berakhot",
  daf: "2b"
});

export { currentDaf };

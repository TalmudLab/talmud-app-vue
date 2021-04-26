import {reactive} from "vue";
import {apiPage} from "../fetch/realm";

export const loadedPages = reactive<{[daf: string]: apiPage}>({});
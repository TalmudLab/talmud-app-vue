import {reactive} from "vue";
import {apiPage} from "../realm";

export const loadedPages = reactive<{[daf: string]: apiPage}>({});
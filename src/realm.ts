import * as Realm from "realm-web";

const app: Realm.App = new Realm.App({ id: "talmudapi-lfaxp" });
let user: Realm.User | null = null;
async function login() {
  // Create an anonymous credential
  const credentials = Realm.Credentials.anonymous();
  try {
    user = await app.logIn(credentials);
    return user
  } catch(err) {
    console.error("Failed to log in", err);
  }
}
type page = {
  tractate: string,
  daf: string,
  main: {
    lines: Array<string>,
    sentences: Array<string>,
    enSentences: Array<string>,
  },
  rashi: string,
  tosafot: string,
  sefariaRashi: Array<Array<string>>,
  sefariaTosafot: Array<Array<string>>
}

type mainSentence = {
  he: string,
  en: string,
  onPage: {
    rashi: undefined | Array<{index: number, ref: string}>,
    tosafot: undefined | Array<{index: number, ref: string}>,
  }
}
type apiPage = {
  tractate: string,
  daf: string
  main: {
    sentences: Array<mainSentence>,
    lines: Array<string>
  },
  rashi: string,
  tosafot: string,
  rashiRefs: Array<string>,
  tosafotRefs: Array<string>
}

async function getPage(tractate: string, daf: string) : Promise<apiPage | undefined> {
  if (user) {
    const returned = await user.functions.getPagePlus(tractate, daf);
    return returned;
  }
  else throw new Error("User wasn't logged in");
}
export {
  login,
  getPage,
  apiPage,
  mainSentence
}
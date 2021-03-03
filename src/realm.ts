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
  tosafot: string
}
async function getPage(tractate: string, daf: string) : Promise<page | undefined> {
  if (user) {
    const returned = await user.functions.getPage(tractate, daf);
    if (returned) {
      returned.tractate = tractate;
      returned.daf = daf;
    }
    return returned;
  }
  else throw new Error("User wasn't logged in");
}
export {
  login,
  getPage,
  page
}
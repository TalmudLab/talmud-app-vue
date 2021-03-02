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
  main: {
    lines: Array<string>,
    sentences: Array<string>
  },
  rashi: string,
  tosafot: string
}
async function getPage(tractate: string, daf: string) : Promise<page | undefined> {
  if (user) {
    return await user.functions.getPage(tractate, daf);
  }
  else throw new Error("User wasn't logged in");
}
export {
  login,
  getPage,
  page
}
import authentification from "./Authentification";

const Middleware = (Page) => {
  return authentification(Page);
};
export default Middleware;

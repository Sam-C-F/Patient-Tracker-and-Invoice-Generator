import * as devData from "../data/dev-data/index.js";
import db from "../index.js";
import seed from "./seed.js";

const runSeed = () => {
  return seed(devData).then(() => db.end());
};

runSeed();

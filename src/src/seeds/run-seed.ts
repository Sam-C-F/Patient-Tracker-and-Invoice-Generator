import * as devData from "../../db/data/dev-data/index";
import db from "../../db/index";
import seed from "../../db/seeds/seed";

const runSeed = () => {
  return seed(devData).then(() => db.end());
};

runSeed();

const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const LOG = console.log;
const checkNumberBulk = require("../utils/checkNumberBulk");

(async () => {
  try {
    const numbersFile = fs.readFileSync(path.resolve("src", "numbers.txt"))?.toString();

    if (!numbersFile.length) {
      LOG(chalk.blue(`Found a numbers file but it has ${chalk.redBright(`no data`)}!`));
      process.exit(0);
    }

    const phoneNumbers = numbersFile.split("\n");
    phoneNumbers && LOG(chalk.blue(`Found a list of phoneNumbers`));

    await checkNumberBulk(phoneNumbers);
  } catch (err) {
    if (err.code === "ENOENT") {
      LOG(chalk.redBright(`File numbers.txt does not exists!`));
      process.exit(0);
    }
  }

  LOG(chalk.blue(`Done! You can find the results in ./logs/results.json`));
  process.exit(0);
})();

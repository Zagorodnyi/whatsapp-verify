const chalk = require("chalk");
const LOG = console.log;
const checkNumber = require("../utils/checkNumber");

(async () => {
  if (process.argv.length < 3) {
    LOG(chalk.red.bold("No Phone Number has been passed"));
    LOG(chalk.blue("Example: npm run check 919898989898"));
    process.exit(0);
  }
  const phoneNumber = process.argv[2];
  LOG(chalk.blue(`Checking for Existence : ${phoneNumber}`));
  const numberExists = await checkNumber(phoneNumber);
  if (numberExists) LOG(chalk.green.bold("Number Exists on Whatsapp"));
  else LOG(chalk.red.bold("Number doesn't exist on Whatsapp"));
  process.exit(0);
})();

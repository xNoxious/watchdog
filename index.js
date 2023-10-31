const API_KEY = "REPLACE_WITH_KEY"; // Replace this with the API key I have provided via email
const ADDRESS = "0x96A8Ba1b5BEb2326C883e46eB03775A72c36a6B3"; // Replace this with an address of your liking
const FILE_NAME = "addressData"; // Name the exported file as you prefer

const { ethers, BigNumber } = require("ethers");
const fs = require("fs");

const customHttpProvider = new ethers.providers.EtherscanProvider(
  "sepolia",
  API_KEY
);

// Using IIFE to avoid callback hell of .then() chains and to be able to await in global file
(async function () {
  const addressBalance = await getBalance();
  await getTransactions(addressBalance);
})();

// GET ADDRESS BALANCE
async function getBalance() {
  const rawBalance = await customHttpProvider.getBalance(ADDRESS); // get raw balance in wei
  return ethers.utils.formatEther(rawBalance); // convert balance from wei to ETH
}

// GET TRANSACTIONS RELATED TO ADDRESS
async function getTransactions(balance) {
  let history = await customHttpProvider.getHistory(ADDRESS);

  // Go through each entry and only take the transaction data that we care about
  history.forEach((entry, index) => {
    const { hash, type, blockNumber, gasPrice, from, value } = entry;
    const trimmedEntry = {
      hash,
      type,
      blockNumber,
      gasPrice: BigNumber.from(gasPrice).toString(),
      from,
      value: BigNumber.from(value).toString(),
    };

    history[index] = trimmedEntry;
  });

  // Append the account we queried and its balance in front of the other data
  let addressData = {
    queriedAddress: ADDRESS,
    balance: balance,
  };
  history[0] = Object.assign(addressData, history[0]);

  exportToCsv(history);
}

// EXPORT TO A FILE
const exportToCsv = (json) => {
  const fields = Object.keys(json[0]);
  const replacer = function (key, value) {
    return value === null ? "" : value;
  };

  let csv = json.map(function (row) {
    return fields
      .map(function (fieldName) {
        return JSON.stringify(row[fieldName], replacer);
      })
      .join(",");
  });
  csv.unshift(fields.join(",")); // add header column
  csv = csv.join("\r\n");

  fs.writeFile(`${FILE_NAME}.csv`, csv, "utf8", function (error) {
    error
      ? console.log("Failed to save CSV.")
      : console.log("CSV file saved successfully!");
  });
};

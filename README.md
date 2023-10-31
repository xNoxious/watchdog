# watchdog

A small script that uses ethers.js to scan a blockchain of our choice to retrieve a given address's balance and history of transactions related to that address.
It is currently set up to observe the Sepolia PoS Testnet of Ethereum via the Etherscan provider.

Written in JavaScript.

To run:

1. Clone the project
3. Run <code>npm install</code>
   
5. Replace the 3 variables at the top with ones of your liking:
```
const API_KEY = "REPLACE_WITH_KEY"; // Replace this with the API key I have provided via email
const ADDRESS = "ETHEREUM_ADDRESS";
const FILE_NAME = "FILE_NAME";
```

5. run <code>node index.js</code>

Some clarifications:
- I have made the script as lightweight as possible so didn't want to include things like Node.js for example where I could have made the script look much cleaner.
- If an address has hundreds of transactions it might take some time to run the script but generally I haven't had problems fetching data quickly.
- Be aware that the provided key is a free one so there is some rate-limiting I assume.
- I have attached a sample .csv file to showcase what the output of running the script looks like.

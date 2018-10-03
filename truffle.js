/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = require('fs').readFileSync("../mnemonic.txt").toString();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*"
    }, 
    ropsten: {
      provider() {
        return new HDWalletProvider(
          mnemonic,
          "https://ropsten.infura.io/v3/55571a7e217a4c699cdb7a6346141d20"
        );
      },
      network_id: 3,
      gas: 4500000
    }
  }
};
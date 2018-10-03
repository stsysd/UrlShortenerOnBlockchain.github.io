var TextShortener = artifacts.require("TextShortener");
module.exports = function(deployer, network) {
  deployer.deploy(TextShortener, () => {
    const fs = require('fs');
    fs.readFile("./build/contracts/TextShortener.json");
  });
};
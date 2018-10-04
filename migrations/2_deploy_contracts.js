var TextShortener = artifacts.require("TextShortener");
module.exports = function(deployer, network) {
  deployer.deploy(TextShortener);
};
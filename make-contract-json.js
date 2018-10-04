function makeContractJson() {
  const fs = require('fs');
  fs.readFile("./build/contracts/TextShortener.json", (err, str) => {
    let data = JSON.parse(str);
    let config = {
      abi: data.abi,
      address: data.networks["3"].address
    };
    fs.writeFileSync("docs/contract.json", JSON.stringify(config, null, 2));
  });
}

makeContractJson();
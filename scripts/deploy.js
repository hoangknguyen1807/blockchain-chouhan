const fs = require('fs');
const hre = require('hardhat');
const ethers = hre.ethers;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('=====================================================================================');
  console.log('DEPLOYER:', deployer.address);
  console.log('DEALER  :', deployer.address);
  console.log('=====================================================================================');
  console.log(`DEPLOYED CONTRACT ADDRESS TO:  ${hre.network.name}`);
  console.log('=====================================================================================');

  const EvenOdd = await ethers.getContractFactory("EvenOdd");

  const evenOdd = await EvenOdd.deploy(deployer.address);
  await evenOdd.deployed();
  console.log(' EvenOdd deployed to:', evenOdd.address);

  // export deployed contracts to json (using for front-end)
  const contractAddresses = {
    "EvenOdd": evenOdd.address
  }
  await fs.writeFileSync("contracts.json", JSON.stringify(contractAddresses));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

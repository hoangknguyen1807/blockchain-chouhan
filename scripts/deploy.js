const fs = require('fs');
const hre = require('hardhat');
const ethers = hre.ethers;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('=====================================================================================');
  console.log('DEPLOYER:', deployer.address);
  console.log('DEALER:', deployer.address);
  console.log('=====================================================================================');
  console.log(`DEPLOYING CONTRACTS TO:  ${hre.network.name}`);
  console.log('=====================================================================================');

  const MCash = await ethers.getContractFactory("MCash");
  const MemberCard = await ethers.getContractFactory("MemberCard");
  const EvenOdd = await ethers.getContractFactory("EvenOdd");

  const mCash = await MCash.deploy();
  await mCash.deployed();
  console.log(' MCash deployed to: ', mCash.address);
  
  const ticket = await MemberCard.deploy("EOTicket", "EOMC", "");
  await ticket.deployed();
  console.log(' MemberCard deployed to: ', ticket.address);
  
  const evenOdd = await EvenOdd.deploy(deployer.address, mCash.address, ticket.address);
  await evenOdd.deployed();
  console.log(' EvenOdd deployed to: ', evenOdd.address);

  // export deployed contracts to json (using for front-end)
  const contractAddresses = {
    "MCash": mCash.address,
    "MemberCard": ticket.address,
    "EvenOdd": evenOdd.address,
  }
  await fs.writeFileSync("contracts.json", JSON.stringify(contractAddresses));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EvenOdd contract unit tests", function () {
  let MCash, MemberCard, EvenOdd;
  let cashInstance, ticketInstance, gameInstance;
  let owner;
  let accounts;

  this.beforeEach(async () => {
    [owner, ...accounts] = await ethers.getSigners();

    MCash = await ethers.getContractFactory("MCash");
    MemberCard = await ethers.getContractFactory("MemberCard");
    EvenOdd = await ethers.getContractFactory("EvenOdd");
    
    cashInstance = await MCash.deploy();
    ticketInstance = await MemberCard.deploy("MemberCard", "EOT");
    
    await cashInstance.deployed();
    await ticketInstance.deployed();

    gameInstance = await EvenOdd.deploy(
      owner.address,
      cashInstance.address,
      ticketInstance.address
    );

    await gameInstance.deployed();

    console.log('    EvenOdd contract deployed to address: ' + gameInstance.address, "\n");
  });

  // this.beforeEach(async function () {
  //   // Get the ContractFactory and Signers here.
  //   [owner, ...accounts] = await ethers.getSigners();
  //   MemberCard = await ethers.getContractFactory("MemberCard");

  //   ticketInstance = await MemberCard.deploy("MemberCard", "EOT");

  //   await ticketInstance.deployed();
  // });

  it("Deployment: initial dealer balance must be 0", async function () {
    expect(await gameInstance.getDealerBalance()).to.equal(0);
  });

  // it("Place bet", async function () {
  //   await gameInstance.rollDice();
  // });
});

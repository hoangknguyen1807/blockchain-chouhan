const { expect } = require("chai");

describe("EvenOdd contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const EvenOdd = await ethers.getContractFactory("EvenOdd");

    const evenOddInstance = await EvenOdd.deploy(owner.address);

    await evenOddInstance.deployed();
    console.log('demo token deployed to address: ' + evenOddInstance.address);

    expect(await evenOddInstance.getDealerBalance()).to.equal(0);
  });
});

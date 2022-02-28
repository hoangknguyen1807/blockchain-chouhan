const { expect } = require("chai");

describe("MCash contract", function () {
  it("Deployment should add deployer to the authorized users list", async function () {
    const [owner] = await ethers.getSigners();

    const MCash = await ethers.getContractFactory("MCash");

    const mCashInstance = await EvenOdd.deploy(owner.address);

    await mCashInstance.deployed();
    console.log('demo token deployed to address: ' + mCashInstance.address);

    expect(await mCashInstance.getDealerBalance()).to.equal(0);
  });
});

const { expect } = require("chai");

describe("EvenOdd contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const EvenOdd = await ethers.getContractFactory("EvenOdd");

    const cashToken = await EvenOdd.deploy(owner.address);

    // await cashToken.deployed();
    // console.log('demo token deployed to address: ' + cashToken.address);

    expect(await cashToken.getDealerBalance()).to.equal(0);
  });
});

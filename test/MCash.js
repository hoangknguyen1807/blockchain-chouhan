const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MCash contract unit tests", function () {
  let MCash;
  let mCashInstance;
  let owner;
  let accounts;

  this.beforeAll(async () => {
    let MCash = await ethers.getContractFactory("MCash");
    let mCashInstance = await MCash.deploy();
    await mCashInstance.deployed();
    
    console.log('  MCash token deployed to address: ' + mCashInstance.address, "\n");
  });

  this.beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    MCash = await ethers.getContractFactory("MCash");
    [owner, ...accounts] = await ethers.getSigners();

    mCashInstance = await MCash.deploy();

    await mCashInstance.deployed();
  });

  it("Initialized total supply value must be 0", async function () {
    expect(await mCashInstance.totalSupply()).to.equal(0);
  });

  it("Initialized balances must all be 0", async function () {
    expect(await mCashInstance.balanceOf(owner.address)).to.equal(0);
    for (let account of accounts) {
      expect(await mCashInstance.balanceOf(account.address)).to.equal(0);
    }
  });

  it("Deployment should add only deployer to the authorized users list", async function () {
    expect(await mCashInstance.isAuthorized(owner.address)).to.equal(true);
    for (let account of accounts) {
      expect(await mCashInstance.isAuthorized(account.address)).to.equal(false);
    }
  });

  it("Internal _mint: Mint 10 MCash token", async function () {
    const $MCash = await ethers.getContractFactory('$MCash');
    const $mCashInstance = await $MCash.deploy();
    
    await $mCashInstance.$_mint(accounts[0].address, 10);

    expect(await $mCashInstance.balanceOf(accounts[0].address)).to.equal(10);

  });

  it("Internal _mint: prevent mint to address(0)", async function () {
    const $MCash = await ethers.getContractFactory('$MCash');
    const $mCashInstance = await $MCash.deploy();

    // const address0 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const address0 = '0x0000000000000000000000000000000000000000';

    await expect($mCashInstance.$_mint(address0, 10)).to.be
      .revertedWith("Cannot send minted token to address(0)!");

  });

  it("Mint 15 MCash token", async function () {
    await mCashInstance.mint(accounts[0].address, 15);

    expect(await mCashInstance.totalSupply()).to.equal(15);
    expect(await mCashInstance.balanceOf(accounts[0].address)).to.equal(15);
  });

  it("Burn 14 MCash token", async function () {
    await mCashInstance.mint(accounts[0].address, 12);
    await mCashInstance.mint(accounts[1].address, 20);

    await mCashInstance.burn(accounts[0].address, 6);
    await mCashInstance.burn(accounts[1].address, 8);

    expect(await mCashInstance.totalSupply()).to.equal(18);
    expect(await mCashInstance.balanceOf(owner.address)).to.equal(0);
    expect(await mCashInstance.balanceOf(accounts[0].address)).to.equal(6);
    expect(await mCashInstance.balanceOf(accounts[1].address)).to.equal(12);
  });

  it("Transfer 11 MCash token with transfer(to, amount)", async function () {
    await mCashInstance.mint(accounts[1].address, 20);

    expect(await mCashInstance.totalSupply()).to.equal(20);
    
    await mCashInstance.connect(accounts[1]).transfer(accounts[0].address, 11);
    
    expect(await mCashInstance.totalSupply()).to.equal(20);
    expect(await mCashInstance.balanceOf(accounts[0].address)).to.equal(11);
    expect(await mCashInstance.balanceOf(accounts[1].address)).to.equal(9);
  });
});

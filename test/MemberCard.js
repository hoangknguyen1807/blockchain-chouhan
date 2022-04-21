const { expect } = require("chai");
const moment = require('moment');

moment().format();

describe("MemberCard contract unit tests", function () {
  let MemberCard;
  let ticketInstance;
  let owner;
  let accounts;

  this.beforeEach(async function () {
    [owner, ...accounts] = await ethers.getSigners();
    MemberCard = await ethers.getContractFactory("MemberCard");

    ticketInstance = await MemberCard.deploy("EOTicket", "EOMC", "evenodd.com/ticket/");

    const rs = await ticketInstance.deployed();
  });

  it("Token collection name MemberCard and symbol EOT", async function () {
    expect(await ticketInstance.name()).to.equal("EOTicket");
    expect(await ticketInstance.symbol()).to.equal("EOMC");
  });

  it("Mint new ticket: must increase balance and set correct owner", async function () {
    ticketInstance.mint(accounts[0].address);
    ticketInstance.mint(accounts[2].address);

    const ticketCount0 = await ticketInstance.balanceOf(accounts[0].address);
    expect(ticketCount0).to.equal(1);
    expect(await ticketInstance.ownerOf(0)).to.equal(accounts[0].address);
    expect(await ticketInstance.tokenOfOwnerByIndex(accounts[0].address, ticketCount0 - 1))
      .to.equal(0);

    const ticketCount1 = await ticketInstance.balanceOf(accounts[2].address);
    expect(ticketCount1).to.equal(1);
    expect(await ticketInstance.ownerOf(1)).to.equal(accounts[2].address);
    expect(await ticketInstance.tokenOfOwnerByIndex(accounts[2].address, ticketCount1 - 1))
      .to.equal(1);
  });

  it("Mint new ticket: due date must be 90 days from now", async function () {
    ticketInstance.mint(accounts[1].address);

    const ticketCount1 = await ticketInstance.balanceOf(accounts[1].address);
    const tokenId = await ticketInstance.tokenOfOwnerByIndex(accounts[1].address, ticketCount1 - 1);

    const dueTs = parseInt(await ticketInstance.getDueDate(tokenId));
    const nowTs = Math.floor(Date.now() / 1000);
    const duration = moment.duration(dueTs - nowTs, 'seconds');
    
    expect(Math.floor(duration.asDays())).to.equal(90);
  });

  it("Function tokenURI(uint256): should return token's URI string", async function () {
    // console.log("");

    const tokenId = 1357;

    await ticketInstance.mint(accounts[0].address);

    const returnedURI = await ticketInstance.tokenURI(0);

    console.log(returnedURI);
  });
});

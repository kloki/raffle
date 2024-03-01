const { expect } = require("chai");

describe("Raffle contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const raffle = await ethers.deployContract("Raffle");

    expect(await raffle.owner).to.equal(owner);
  });
});

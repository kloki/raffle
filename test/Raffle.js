const { expect } = require("chai");

describe("Raffle contract", function () {
  it("Deployment should set the correct owner", async function () {
    const [owner] = await ethers.getSigners();

    const raffle = await ethers.deployContract("Raffle");

    expect(await raffle.owner()).to.equal(owner);
  });
  it("Cannot join own contract", async function () {
    const raffle = await ethers.deployContract("Raffle");

    await expect(raffle.join()).to.be.revertedWith(
      "Cannot join your own raffle"
    );
    // expect(await raffle.participants().length).to.equal(0);
  });
  it("Success", async function () {
    const [_, p1, p2] = await ethers.getSigners();
    const raffle = await ethers.deployContract("Raffle");
    await raffle.connect(p1).join();
    await raffle.connect(p2).join();
    // expect(await raffle.participants().length).to.equal(2);
  });
  it("Cannot join twice", async function () {
    const [_, p1] = await ethers.getSigners();
    const raffle = await ethers.deployContract("Raffle");
    await raffle.connect(p1).join();
    await expect(raffle.connect(p1).join()).to.be.revertedWith(
      "Cannot join raffle twice"
    );
    // expect(await raffle.participants().length).to.equal(2);
  });
});

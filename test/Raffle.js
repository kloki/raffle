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
    expect(await raffle.size()).to.equal(0);
  });
  it("Success", async function () {
    const [_, p1, p2] = await ethers.getSigners();
    const raffle = await ethers.deployContract("Raffle");
    await raffle.connect(p1).join();
    await raffle.connect(p2).join();
    expect(await raffle.size()).to.equal(2);
  });
  it("Cannot join twice", async function () {
    const [_, p1] = await ethers.getSigners();
    const raffle = await ethers.deployContract("Raffle");
    await raffle.connect(p1).join();
    await expect(raffle.connect(p1).join()).to.be.revertedWith(
      "Cannot join raffle twice"
    );
    expect(await raffle.size()).to.equal(1);
  });
  it("Can't join when closed", async function () {
    const [owner, p1, p2] = await ethers.getSigners();
    const raffle = await ethers.deployContract("Raffle");
    await raffle.connect(p1).join();
    expect(await raffle.size()).to.equal(1);
    await raffle.connect(owner).finalize();
    await expect(raffle.connect(p2).join()).to.be.revertedWith(
      "Raffle is closed"
    );
  });
  it("Non owner can't finalize", async function () {
    const [_, p1, p2] = await ethers.getSigners();
    const raffle = await ethers.deployContract("Raffle");
    await raffle.connect(p1).join();
    expect(await raffle.size()).to.equal(1);
    await expect(raffle.connect(p2).finalize()).to.be.revertedWith(
      "Only owner can finalize"
    );
  });
  it("Can't close twice", async function () {
    const [owner, p1] = await ethers.getSigners();
    const raffle = await ethers.deployContract("Raffle");
    await raffle.connect(p1).join();
    await raffle.connect(owner).finalize();
    await expect(raffle.connect(owner).finalize()).to.be.revertedWith(
      "Raffle is already closed"
    );
  });
  it("Can't finalize without participants", async function () {
    const raffle = await ethers.deployContract("Raffle");
    await expect(raffle.finalize()).to.be.revertedWith("No participants");
  });
  it("Happy flow", async function () {
    const [owner, p1, p2, p3, p4, p5] = await ethers.getSigners();
    const raffle = await ethers.deployContract("Raffle");
    await raffle.connect(p1).join();
    await raffle.connect(p2).join();
    await raffle.connect(p3).join();
    await raffle.connect(p4).join();
    await raffle.connect(p5).join();
    expect(await raffle.size()).to.equal(5);
    await raffle.connect(owner).finalize();
    expect(await raffle.is_closed()).to.equal(true);
    expect(await raffle.winner()).to.not.undefined;
  });
});

const hre = require("hardhat");
async function getBalances(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function cosoleBalances(addresses) {
  let counter = 0;
  for (const address of addresses) {
    console.log(`Address ${counter} balance:`, await getBalances(address));
    counter++;
  }
}
async function consoleMemos(AllMsgs) {
  for (const AllMsg of AllMsgs) {
    const timestamp = AllMsg.timestamp;
    const name = AllMsg.name;
    const from = AllMsg.from;
    const message = AllMsg.message;
    console.log(
      `At ${timestamp},name ${name},address ${from},message ${message}`
    );
  }
}
async function main() {
  const [owner, from1, from2, from3] = await hre.ethers.getSigners();
  const msgApp = await hre.ethers.getContractFactory("msgApp");
  const contract = await msgApp.deploy(); //instance of contract

  await contract.deployed();
  console.log("Address of contract:", contract.address);

  const addresses = [
    owner.address,
    from1.address,
    from2.address,
    from3.address,
  ];
  console.log("Before buying chai");
  await cosoleBalances(addresses);

  const amount = { value: hre.ethers.utils.parseEther("1") };
  await contract.connect(from1).buy("from1", "Very nice chai", amount);
  await contract.connect(from2).buy("from2", "Very nice course", amount);
  await contract
    .connect(from3)
    .buy("from3", "Very nice information", amount);

  console.log("After buying chai");
  await cosoleBalances(addresses);

  const memos = await contract.getAllMsg();
  consoleMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

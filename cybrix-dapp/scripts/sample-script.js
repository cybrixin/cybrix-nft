// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
import hre from "hardhat";

try {
  
  const CybrixGuys = await hre.ethers.getContractFactory('CybrixGuys');
  const cybrixguys = await CybrixGuys.deploy();

  await cybrixguys.deployed();

  console.log("CybrixGuys NFT deployed to:", cybrixguys.address);

} catch (error) {
  console.log(error)
  process.exit(1);
}
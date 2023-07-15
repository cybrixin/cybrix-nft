const { expect } = require('chai');
const { ethers } = require("hardhat");
const dotenv = require('dotenv')
dotenv.config();

describe('CybrixGuys.sol Test', () => { 
    it("Should mint and transfer an NFT to recipient", async function () {

        const CybrixGuys = await ethers.getContractFactory("CybrixGuys");

        const cybrixguys = await CybrixGuys.deploy();
        await cybrixguys.deployed();
        
        const recipient = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199';
        const metadataURI = `${process.env.PUBLIC_PUNK_CID}/test-0.png`

        let balance = await cybrixguys.balanceOf(recipient);

        expect(balance).equal(0);

        const newlyMintedToken = await cybrixguys.payToMint(recipient, metadataURI, {value: ethers.utils.parseEther('0.03')})

        await newlyMintedToken.wait();
        
        balance = await cybrixguys.balanceOf(recipient)
        expect(balance).to.equal(1);

        expect(await cybrixguys.isContentOwned(metadataURI)).to.equal(true);

    });
})
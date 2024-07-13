const main = async () => {
    const contractFactory = await ethers.getContractFactory('EscrowMarketplace');
    const contract = await contractFactory.deploy();
    await contract.deployed();
  
    console.log("Contract deployed to:", contract.address);
  }
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
  
  runMain();
  
  //Contract deployed to: 0x99B52141E6351b235005ad87A32A351243893Ec8
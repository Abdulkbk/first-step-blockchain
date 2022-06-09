require('@nomiclabs/hardhat-waffle')

const SECRET_KEY = process.env.SECRET_KEY

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4',
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ropsten: {
      url: 'https://ropsten.infura.io/v3/64b7b04b176642749fa7b67d1c67d0be',
      accounts: [`0x${SECRET_KEY}`],
      gasPrice: 8000000000,
    },
  },
}

// console.log(process.env.REACT_APP_SECRET_KEY)

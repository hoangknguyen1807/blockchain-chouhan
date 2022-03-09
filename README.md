# ETH Even Odd
## Development

#### Setup

Make sure these tools are installed with the correct version

- `solc` `0.8.0`

#### Build and Test
Install dependencies
```console
cmd$> npm install
```

Run local network
```console
cmd$> npx hardhat node
```

Compile contracts
```console
cmd$> npx hardhat compile
```

Deploy contracts (default is local network `hardhat`)
```console
cmd$> npx hardhat run scripts/deploy.js --network <your-network>
```

Run verification of contract
```console
cmd$> npx hardhat verify <contract address> <arguments> --network <network>
```

Refer to ethereum-waffle documentation for Chai matchers [here](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html#revert-with-message)

Run all javascript tests
```console
cmd$> npx hardhat test
```

Run specified javascript test or specified network (default is local network `hardhat`)
```console
cmd$> npx hardhat test <test-file-path> --network <your-network>
```

Run test coverage assessment
```console
cmd$> npx hardhat coverage --testfiles "test/*.js" 
```

Run solhint
```console
cmd$> npx solhint --formatter table 'contracts/**/*.sol'
```

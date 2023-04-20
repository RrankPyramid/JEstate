# JEstate - A Revolutionary Decentralised Trading Platform in the Metaverse

## Introduction

Welcome to JEstate, the innovative decentralised trading platform designed for the metaverse. Our cutting-edge solution leverages the power of blockchain technology to transform the way you trade, invest, and interact with digital properties within the virtual world. By incorporating advanced features such as enhanced identity verification and tamper-evidence, JEstate is committed to providing a secure, transparent, and seamless experience that surpasses traditional centralised platforms.

In the rapidly expanding metaverse, security and trust are paramount. JEstate's blockchain-based infrastructure ensures that your transactions and personal information remain secure through robust encryption and decentralisation. This not only allows users to have full control over their digital properties but also eliminates the need for third-party intermediaries, reducing the risk of fraud and hacking.

By integrating with MetaMask, a popular Ethereum wallet and browser extension, you can easily access our platform's wide range of innovative features tailored to the metaverse, including:

1. Trading: Buy, sell, and exchange digital properties within the metaverse with ease, all within a secure and user-friendly environment.
2. Check-in: Move into your virtual properties or manage vacant houses, providing you with the flexibility to auction or sell as desired.
3. Auction: Participate in thrilling auctions, bid on unique virtual properties, and unlock exclusive opportunities within the metaverse.
4. Display: Showcase your digital property portfolio, share your accomplishments, and connect with like-minded enthusiasts.
5. Rename: Personalize your virtual properties and make them truly your own with our customizable naming feature.
6. And many more: Stay tuned for regular updates as we continue to roll out additional features and enhancements based on user feedback and market trends.

In the context of the metaverse, we understand that property rights are crucial. JEstate's decentralised platform ensures that your property information is not solely dependent on a single service provider's server, thereby preventing unlawful infringements by Meta Universe service providers. Our blockchain-based solution guarantees that your property rights are protected at all times, offering you peace of mind as you navigate the virtual landscape.

Join our growing community and discover the many benefits and opportunities that await you in the metaverse with JEstate. Experience a secure, transparent, and innovative trading platform designed for the future of digital property management and interaction.



## JEstate Quick Start Guide

Follow these steps to get started with the JEstate platform:

### Step 1: Install Node.js environment

Install the Node.js environment using nvm (Node Version Manager). Follow the installation and update instructions here:
https://github.com/nvm-sh/nvm#installing-and-updating

### Step 2: Deploy the local blockchain (optional)

You can choose to run the project on a local chain or deploy it on a public test chain. This tutorial uses a local chain as an example. To deploy the local blockchain using ganache-cli, navigate to the JEState directory and run the following commands:

```bash
$ cd JEState
$ npm install ganache-cli
$ npx ganache-cli -p 7545 --deterministic
```

**Note:** If you want to use another network, be sure to modify your own contract address in website/src/constants/contract.js.

### Step 3: Deploy the smart contract
We use Truffle for compiling and deploying smart contracts. To deploy the smart contract, run the following commands:
```bash
$ cd JEState/truffle
$ npm install truffle
$ npm install @openzeppelin/contracts
$ npx truffle migrate --network development
```

### Step 4: Test contract security (optional)
After successfully deploying the contract, you can run functionality and integrity tests with this command:
```bash
$ npx truffle test
```

### Step 5: Download MetaMask
Using the Firefox browser, download and install the following plug-ins:

MetaMask: https://metamask.io/download
MetaMask Legacy Web3: https://addons.mozilla.org/en-US/firefox/addon/metamask-legacy-web3/

You can also find it in Firefox plug-in market.

### Step 6: Start the web server
Ensure Docker is installed on your system (https://docs.docker.com/get-docker/). Then, go back to the project root directory and run the following command:
```bash
$ docker compose -f docker-compose.dev.yml
```

### Step 7: Launch the web page
Open your browser and visit http://localhost:3000 to access the full web page. If you are running it for the first time, you may need to register a MetaMask local wallet. This wallet is local, and all data will not be uploaded to the web page. It's just a security gate.

Happy trading on the JEstate platform!

## How to create a property in JEState?

In the JEState platform there is a limited number of people who can create virtual properties. You must qualify as a contract owner in order to create a new property. To try to create a new property on your local test chain, you can use the following steps:

### Step 1: Switch to the correct directory.
```bash
cd JEstate/truffle
```

### Step 2: Open the truffle console.
```bash
npx truffle console --network development
```

### Step 3: Create new property by following command:
```nodejs
let nft=await nftContract.deployed();
nft.createProperty("YourPropertyName", "YourPropertyCid", "Rarity");
```

**Note: ** Our project use IPFS system to store the image of property(NFT). If you want to create a image of NFT yourself, you can choose create a local IPFS system (See https://ipfs.tech/#install). Or you may upload it to a public IPFS platform (Like Pinata: https://www.pinata.cloud/ )

Then, you will see the new NFT showing in the website.
Enjoy!




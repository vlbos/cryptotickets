const opensea = require('opensea-js')
const OpenSeaPort = opensea.OpenSeaPort;
const Network = opensea.Network;

const MnemonicWalletSubprovider = require('@0x/subproviders').MnemonicWalletSubprovider
const RPCSubprovider = require('web3-provider-engine/subproviders/rpc')
const Web3ProviderEngine = require('web3-provider-engine')
const MNEMONIC = "vintage evoke frost two apology bachelor steak year minimum offer glare gentle"
const INFURA_KEY = "e5c098f7442a419b86124b81722e406e"
const FACTORY_CONTRACT_ADDRESS = "0x99d804308ead004888beca66bc0798850fb238b8"
const OWNER_ADDRESS = "0xf19797d8520F42364925407c41D2Aa89979d0aDb"
const NETWORK = "Rinkeby"
const API_KEY = "15705f90719a4ff6b66d49ea481b6b57"
const DUTCH_AUCTION_OPTION_ID = "1";
const DUTCH_AUCTION_START_AMOUNT = 100;
const DUTCH_AUCTION_END_AMOUNT = 50;    
const NUM_DUTCH_AUCTIONS = 5;

const FIXED_PRICE_OPTION_ID = "0";
const NUM_FIXED_PRICE_AUCTIONS = 10;
const FIXED_PRICE = 100;

const INCLINE_PRICE_START = 10;
const INCREMENT_AMOUNT = 10;
const NUM_PER_INCREMENT = 5;
const NUM_INCREMENTS = 20;

if (!MNEMONIC || !INFURA_KEY || !NETWORK || !OWNER_ADDRESS || !FACTORY_CONTRACT_ADDRESS || !API_KEY) {
    console.error("Please set a mnemonic, infura key, owner, network, API key, and factory contract address.")
    return
}
const BASE_DERIVATION_PATH = `44'/60'/0'/0`;
const mnemonicWalletSubprovider = new MnemonicWalletSubprovider({ mnemonic: MNEMONIC, baseDerivationPath: BASE_DERIVATION_PATH})
const infuraRpcSubprovider = new RPCSubprovider({
    rpcUrl: 'https://' + NETWORK + '.infura.io/' + INFURA_KEY,
})

const providerEngine = new Web3ProviderEngine()
providerEngine.addProvider(mnemonicWalletSubprovider)
providerEngine.addProvider(infuraRpcSubprovider)
providerEngine.start();

const seaport = new OpenSeaPort(providerEngine, {
  networkName: Network.Rinkeby,
  apiKey: API_KEY
}, (arg) => console.log(arg))

async function main() {

    // Example: many fixed price auctions.
    console.log("Creating fixed price auctions...")
    const fixedSellOrders = await seaport.createFactorySellOrders({
        assetId: FIXED_PRICE_OPTION_ID,
        factoryAddress: FACTORY_CONTRACT_ADDRESS,
        accountAddress: OWNER_ADDRESS,
        startAmount: FIXED_PRICE,
        numberOfOrders: NUM_FIXED_PRICE_AUCTIONS
    })
    console.log(`Successfully made ${fixedSellOrders.length} fixed-price sell orders! ${fixedSellOrders[0].asset.openseaLink}\n`)

    // Example: many declining Dutch auction.
    console.log("Creating dutch auctions...")
    // Expire one day from now
    const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24)
    const dutchSellOrders = await seaport.createFactorySellOrders({
        assetId: DUTCH_AUCTION_OPTION_ID,
        factoryAddress: FACTORY_CONTRACT_ADDRESS,
        accountAddress: OWNER_ADDRESS, 
        startAmount: DUTCH_AUCTION_START_AMOUNT,
        endAmount: DUTCH_AUCTION_END_AMOUNT,
        expirationTime: expirationTime,
        numberOfOrders: NUM_DUTCH_AUCTIONS
    })
    console.log(`Successfully made ${dutchSellOrders.length} Dutch-auction sell orders! ${dutchSellOrders[0].asset.openseaLink}\n`)

    // TODO: Incremental prices example.
}

main()
export const AVALANCHE_MAINNET_PARAMS = {
    chainId: '0xa86a', // A 0x-prefixed hexadecimal chainId
    chainName: 'Avalanche Mainnet C-Chain',
    nativeCurrency: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://cchain.explorer.avax.network/']
}

export const AVALANCHE_TESTNET_PARAMS = {
    chainId: '0xa869', // A 0x-prefixed hexadecimal chainId
    chainName: 'Avalanche Testnet C-Chain',
    nativeCurrency: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://cchain.explorer.avax-test.network/']
}
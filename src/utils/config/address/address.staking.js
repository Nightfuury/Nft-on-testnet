const stakingAddressList = {
    harmonylp: {
        bsc: {
            mainnet: {
                address: '',
            },
            testnet: {
                address: '0xe1a5f12183cde4f99c4628623b1eb828fd08291c',
            },
        },
    }
}

export const fetchStakingAddressData = (
    { name, blockchain, network } = { blockchain: 'bsc', network: 'mainnet' }
) => stakingAddressList[`${name}`][`${blockchain}`][`${network}`].address;
const tierStakingAddressList = {
    harmonyTier: {
        fantom: {
            mainnet: {
                address: '',
            },
            testnet: {
                address: '0x9c3ec46cc50a3870fc6f186b67d7b5de4e13a1d6',
            },
        },
    }
}

export const fetchTierStakingAddressData = (
    { name, blockchain, network } = { blockchain: 'bsc', network: 'mainnet' }
) => tierStakingAddressList[`${name}`][`${blockchain}`][`${network}`].address;
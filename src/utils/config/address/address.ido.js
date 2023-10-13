const idoAddressList = {
    harmony: {
        fantom: {
            mainnet: {
                address: '',
            },
            testnet: {
                address: '0xd7ff59264ee0c087b035ff45f51f6551bb409a3a',
            },
        },
    }
}

export const fetchIdoAddressData = (
    { idoName, blockchain, network } = { blockchain: 'bsc', network: 'mainnet' }
) => idoAddressList[`${idoName}`][`${blockchain}`][`${network}`].address;
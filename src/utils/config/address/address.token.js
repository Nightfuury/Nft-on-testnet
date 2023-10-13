const tokenAddressList = {
    usdt: {
        fantom: {
            mainnet: {
                address: '',
            },
            testnet : {
                address : '0xb17340ec6d5b676c1338c4460cd68e88b9a96154'
            }
        }
    },
    harmonylp: {
        bsc: {
            mainnet: {
                address: '',
            },
            testnet : {
                address : '0x2dc1324801501af263101eb4c62d5883cf646e95'
            }
        }
    },
    harmonyTier: {
        fantom: {
            mainnet: {
                address: '',
            },
            testnet : {
                address : '0xde3b87aadee67725d579601d3a72abdbf4d33a33'
            }
        }
    }
}

export const fetchTokenAddressData = (
    { tokenName, blockchain, network } = { blockchain: 'bsc', network: 'mainnet' }
) => tokenAddressList[`${tokenName}`][`${blockchain}`][`${network}`].address;
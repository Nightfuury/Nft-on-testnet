const stakingList = {
    harmony: {
        name: 'Harmony',
        symbol: 'HSTR',
        decimals: 18,
        stkBlockchain : 'bsc',
        stkNetwork : 'testnet',
        stkConnectedNetwork : 'BSC Testnet'
    }
}

export const fetchStakingDetails = (
    { idoName } = { idoName: 'harmony' }
) => stakingList[`${idoName}`];
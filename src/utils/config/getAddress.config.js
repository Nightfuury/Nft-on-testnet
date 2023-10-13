import { fetchTokenAddressData } from '../config/address/address.token';
import { fetchIdoAddressData } from '../config/address/address.ido';
import { fetchStakingAddressData } from './address/address.staking';
import { fetchTierStakingAddressData } from './address/address.tier.staking';
import { fetchStakingAbi } from './stakingAbi/getStaking.abi';
import { fetchIdoAbi } from './idoAbi/ido.abi';

export const fetchAddressConfig = (
    { name, type, blockchain, network } = {
        type: 'TOKEN',
        blockchain: 'bsc',
        network: 'mainnet',
    }
) => {
    if (type === 'TOKEN') {
        return {
            address: fetchTokenAddressData({ tokenName: name, blockchain: blockchain, network: network }),
        };
    }

    if (type === 'IDO') {
        return {
            abi: fetchIdoAbi({ name: name }),
            address: fetchIdoAddressData({ idoName: name, blockchain: blockchain, network: network }),
        };
    }

    if (type === 'STAKING') {
        return {
            abi: fetchStakingAbi({ name: name }),
            address: fetchStakingAddressData({ name: name, blockchain: blockchain, network: network }),
        };
    }

    if (type === 'TIERSTAKING') {
        return {
            abi: fetchStakingAbi({ name: name }),
            address: fetchTierStakingAddressData({ name: name, blockchain: blockchain, network: network }),
        };
    }
};
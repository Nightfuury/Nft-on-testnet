
import { retrieveContractInstance } from './contract.instance.service';

import { tokenABI } from '../../utils/abi/token/token.abi';

import { deploymentEnv } from '../../utils/constants/constants';

// smart contract deployment environment : testnet or mainnet

export const requestContractBalance = async (
    { tokenAddress, contractAddress, blockchain, network, instance } = {
        network: deploymentEnv,
        instance: 'rpcUrl',
    }
) => {
    try {
        const contractInstance = await retrieveContractInstance({
            abi: tokenABI,
            address: tokenAddress,
            blockchain: blockchain || 'bsc',
            network,
            instance,
        });

        const balance = await contractInstance.methods
            .balanceOf(contractAddress)
            .call();

        return balance;
    } catch (err) {
        console.error('requestContractBalance: error: ', err);
    }
};

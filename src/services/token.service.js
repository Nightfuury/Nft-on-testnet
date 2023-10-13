
import { initWeb3 } from './web3.service';
import { retrieveContractInstance } from './contract/contract.instance.service';
import { tokenABI } from '../utils/abi/token/token.abi';

import { deploymentEnv } from '../utils/constants/constants';

// requestAllowance -> fetches user's token approved allowance
export const requestAllowance = async ({
    accountAddress,
    stakingAddress,
    tokenAddress,
    blockchain,
    network = deploymentEnv,
    instance = 'metamask',
} = {}) => {
    try {
        const contractInstance = await retrieveContractInstance({
            abi: tokenABI,
            address: tokenAddress,
            blockchain: blockchain || 'bsc',
            network,
            instance,
        });

        const allowance = await contractInstance.methods
            .allowance(accountAddress, stakingAddress)
            .call();

        return allowance;
    } catch (err) {
        console.error('Error: requestAllowance: ', err);
    }
};

// requestApproveAllowance -> approves allowance
export const requestApproveAllowance = async ({
    tokenAddress,
    stakingAddress,
    accountAddress,
    blockchain,
    network = deploymentEnv,
    instance = 'metamask',
    amount = 9999999999,
} = {}) => {
    try {
        const contractInstance = await retrieveContractInstance({
            abi: tokenABI,
            address: tokenAddress,
            blockchain: blockchain || 'bsc',
            network,
            instance,
        });

        const web3 = await initWeb3({
            blockchain: blockchain || 'bsc',
            network,
            instance,
        });
        await contractInstance.methods
            .approve(stakingAddress, web3.utils.toWei(String(amount), 'ether'))
            .send({ from: accountAddress, to: stakingAddress });
    } catch (err) {
        console.error('Error: requestApproveAllowance: ', err);
    }
};

export const requestTokenStats = async (
    { userAddress, tokenAddress, blockchain, network, instance } = {
        network: deploymentEnv,
        instance: 'metamask',
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

        const tokenName = await contractInstance.methods.name().call();

        const tokenSymbol = await contractInstance.methods.symbol().call();

        const tokenSupply = await contractInstance.methods.totalSupply().call();


        let userTokenBalance;
        if (userAddress) {
            userTokenBalance = await contractInstance.methods
                .balanceOf(userAddress)
                .call();
        }

        return {
            tokenName,
            tokenSymbol,
            tokenSupply,
            userTokenBalance,
        };
    } catch (err) {
        console.error('Error: requestTokenStats: ', err);
    }
};

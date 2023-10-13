import Web3 from 'web3';

import { fetchNetworkData } from '../utils/config/network.config';

export const initWeb3 = async (
  { blockchain, network, instance } = {
    blockchain: 'bsc',
    network: 'mainnet',
    instance: 'metamask',
  }
) => {
  console.info('blockchain: ', blockchain);
  try {
    let web3;

    if (instance === 'metamask' && typeof window.ethereum !== 'undefined') {
      // web3 instance for metamask
      web3 = new Web3(window.ethereum);

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      return web3;
    }

    const { rpcUrl } = fetchNetworkData({
      blockchain: blockchain || 'bsc',
      network,
    });
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

    return web3;
  } catch (err) {
    console.error('Error: initWeb3: ', err);
  }
};

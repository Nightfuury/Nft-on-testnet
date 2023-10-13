import { initWeb3 } from '../web3.service';

export const retrieveContractInstance = async ({
  abi,
  address,
  blockchain = 'bsc',
  network = 'mainnet',
  instance = 'metamask',
} = {}) => {
  try {
    // Creating instance of web3
    const web3 = await initWeb3({
      blockchain,
      network,
      instance,
    });
    //const add = web3.utils.toChecksumAddress(address)
    // Creating instance of contract
    const contractInstance = new web3.eth.Contract(abi, address);

    return contractInstance;
  } catch (err) {
    console.error('Error: retrieveContractInstance: ', err);
  }
};

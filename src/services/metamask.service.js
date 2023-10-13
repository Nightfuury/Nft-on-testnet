import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

import { metamaskNetworkChainID } from '../utils/config/network.chainid';
import { fetchNetworkData } from '../utils/config/network.config';


export const connectMetamask = async () => {
    try {
        // Check if metamask extension is installed in the browser
        if (typeof window.ethereum !== 'undefined') {
            // web3 instance for metamask
            const web3 = new Web3(window.ethereum);

            await window.ethereum.request({ method: 'eth_requestAccounts' });

            return web3;
        }
        console.warn('Please install Metamask!');
        return false;
    } catch (err) {
        // User denied access
        console.error('connectMetamask error: ', err);
    }
};

export const checkMetamaskIsConnected = async () => {
    try {
        // Check if metamask extension is installed in the browser
        if (typeof window.ethereum !== 'undefined') {
            // web3 instance for metamask
            const web3 = new Web3(window.ethereum);

            const accounts = await web3.eth.getAccounts();

            return !!accounts.length;
        }

        return false;
    } catch (err) {
        // User denied access
        console.error('handleConnect error: ', err);
        return false;
    }
};

export const fetchMetamaskAccountDetails = async () => {
    try {
        const web3 = await connectMetamask();

        // Fetch metamask provider (network)
        const provider = await detectEthereumProvider();

        console.info('provider.chainId: ', provider.chainId);

        // Figuring out network via chainId
        const { network } = metamaskNetworkChainID(provider.chainId);
        console.info('fetchMetamaskAccountDetails network: ', network);

        // Request Metamask account access

        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const accounts = await web3.eth.getAccounts();
        const balance = await web3.eth.getBalance(accounts[0]);

        return {
            accounts,
            connectedNetwork: network,
            connectedAccount: accounts[0],
            balance: web3.utils.fromWei(balance, 'ether'),
        };
    } catch (err) {
        console.error('fetchMetamaskAccountDetails error : ', err);
        return {
            accounts: [],
            connectedNetwork: null,
            connectedAccount: null,
            balance: null,
        };
    }
};

export const handleAddToken = async ({ address, symbol }) => {
    try {
        await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address,
                    symbol,
                    decimals: 18,
                },
            },
        });
    } catch (err) {
        console.error('handleAddToken: error: ', err);
    }
};

export const switchMetamaskNetwork = async (
    { blockchain, network } = { blockchain: 'bsc', network: 'mainnet' }
) => {
    console.log('-----------', blockchain, network);
    const networkDetails = fetchNetworkData({
        blockchain,
        network,
    });

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: networkDetails.chainId }],
        });
    } catch (errSwitchNetwork) {
        console.warn('switchMetamaskNetwork: err: ', errSwitchNetwork);

        if (errSwitchNetwork.code === 4902) {
            try {
                const data = [
                    {
                        chainId: networkDetails.chainId,
                        chainName: networkDetails.name,
                        nativeCurrency: {
                            name: networkDetails.name,
                            symbol: networkDetails.symbol,
                            decimals: 18,
                        },
                        rpcUrls: networkDetails.rpcUrls,
                        blockExplorerUrls: networkDetails.blockExplorerUrls,
                    },
                ];

                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: data,
                });
            } catch (errAddNetwork) {
                // handle "add" error
                console.error('wallet_addEthereumChain: err: ', errAddNetwork);
            }
        }
    }
};

// ---added--

export const metamaskInit = async () => {
    try {
        const provider = await detectEthereumProvider();

        let web3 = null;
        let accounts = null;
        let hasError = false;
        let errorInfo = null;
        if (provider) {
            // console.info('Ethereum successfully detected!');
            // From now on, this should always be true:
            // provider === window.ethereum
            if (provider !== window.ethereum) {
                console.error('Do you have multiple wallets installed?');
            }
            web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
            await provider.request({
                method: 'eth_requestAccounts',
            });

            accounts = await web3.eth.getAccounts();
        } else {
            hasError = true;
            errorInfo = 'Please install MetaMask!';
        }

        return {
            account: accounts[0] || null,
            hasError,
            errorInfo,
        };
    } catch (err) {
        console.error('metamaskInit -> error: ', err);
        return {
            account: null,
            hasError: true,
            errorInfo: err.message,
        };
    }
};

export const metamaskBalance = async (account) => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
    const balance = await web3.eth.getBalance(account);
    return balance;
};

export const metamaskChainId = async () => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

    const chainId = await web3.eth.getChainId();
    return chainId;
};

export const nameForNetworksViaChainId = (chainId) => {
    console.log(`------>>>> kya yar ${chainId}<<<<<-----`);
    let network = '';
    switch (chainId) {
        case '0x1':
            network = 'MAINNET';
            break;
        case '0x3':
            network = 'ROPSTEN';
            break;
        case '0x4':
            network = 'RINKEBY';
            break;
        case '0x5':
            network = 'GOERLI';
            break;
        case '0x2a':
            network = 'KOVAN';
            break;
        case '0x38':
            network = 'BSC';
            break;
        case '0x61':
            network = 'BSC TESTNET';
            break;
        case '0xa86a':
            network = 'Avalanche';
            break;
        case '0xfa':
            network = 'Fantom Mainnet';
            break;
        case '0xfa2':
            network = 'Fantom Testnet';
            break;
        default:
            network = 'OTHER';
    }

    return network;
};
export const metamaskNetworksViaChainId = (chainId) => {
    let network = '';
    const error = false;

    // Networks Associated ChainIds:
    // 0x1 	  1 	Ethereum Main Network (Mainnet)
    // 0x3 	  3 	Ropsten Test Network
    // 0x4 	  4 	Rinkeby Test Network
    // 0x5 	  5 	Goerli Test Network
    // 0x2a 	42 	Kovan Test Network
    // 0x38   56  BSC Main Network (Mainnet)
    // 0x61   97  BSC Test Network

    console.log(`------>>>>  ${chainId}<<<<<-----`);
    switch (chainId) {
        case '0x1':
            network = 'MAINNET';
            break;
        case '0x3':
            network = 'ROPSTEN';
            break;
        case '0x4':
            network = 'RINKEBY';
            break;
        case '0x5':
            network = 'GOERLI';
            break;
        case '0x2a':
            network = 'KOVAN';
            break;
        case '0x38':
            network = 'BSC_MAINNET';
            break;
        case '0x61':
            network = 'BSC_TESTNET';
            break;
        default:
            network = 'OTHER';
    }

    return {
        network,
        error,
    };
};

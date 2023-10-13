import React from "react";
import detectEthereumProvider from "@metamask/detect-provider";

import {
    metamaskInit,
    metamaskBalance,
    metamaskNetworksViaChainId,
    switchMetamaskNetwork,
} from "../../services/metamask.service";


import { contractDeployedNetwork, deploymentEnv ,BSC_MAINNET} from "../../utils/constants/constants.js";
import { fetchNetworkData } from "../../utils/config/network.config";

export const MetamaskConnectContext = React.createContext();

export const MetamaskConnectContextProvider = ({ children }) => {
    const [loadingMetamask, setLoadingMetamask] = React.useState(true);
    const [account, setAccount] = React.useState(null);
    const [balance, setBalance] = React.useState(0);
    const [metamaskNetwork, setMetamaskNetwork] = React.useState(null);
    const [metamaskChainId, setMetamaskChainId] = React.useState(null);
    const [hasError, setHasError] = React.useState(false);
    const [errorInfo, setErrorInfo] = React.useState(null);

    const handleSwitchMetamaskNetwork = async ({
        blockchain = "bsc",
        network = "mainnet",
    }) => {
        await switchMetamaskNetwork({ blockchain, network });
    };

    const isMetamaskNetworkValid = () =>
        metamaskNetwork === contractDeployedNetwork;

    const isMetamaskNetworkBsc = () =>
        metamaskNetwork === BSC_MAINNET;

    const isMetamaskNetworkAvalanche = () =>
        metamaskChainId === fetchNetworkData({ blockchain: 'avalanche', network: deploymentEnv }).chainId;



    const metamaskChainIdName = () =>
        metamaskChainId

    const updateStates = (metamaskInitObj) => {
        setAccount(metamaskInitObj.account);
        setHasError(metamaskInitObj.hasError);
        setErrorInfo(metamaskInitObj.errorInfo);
    };

    const onMetamaskInit = async () => {
        // console.info('onMetamaskInit: hit!');
        try {
            const provider = await detectEthereumProvider();
             console.info('metamask current provider chainID: ', provider.chainId);
            const { network } = metamaskNetworksViaChainId(provider.chainId);
             console.info('metamask network : ', network);
            setMetamaskNetwork(network);
            setMetamaskChainId(provider.chainId);

            const metamaskInitObj = await metamaskInit();
            // console.info('metamaskInitObj: ', metamaskInitObj);
            if (metamaskInitObj.account) {
                const accBalance = await metamaskBalance(metamaskInitObj.account);
                setBalance(accBalance);
            }
            updateStates(metamaskInitObj);
            const jsonValue = JSON.stringify(metamaskInitObj);
            await window.sessionStorage.setItem("@metamask", jsonValue);
        } catch (error) {
            console.error("metamask context error: ", error);
        }
    };

    const onMetamaskReset = async () => {
        setAccount(null);
        setHasError(false);
        setErrorInfo(null);

        await window.sessionStorage.removeItem("@metamask");
    };

    const loadMetamask = async () => {
        try {
            setLoadingMetamask(true);
            // console.info('window.web3.eth: ', window.web3.eth);

            await onMetamaskInit();

            const provider = await detectEthereumProvider();
            // console.info('metamask current provider chainID: ', provider.chainId);
            const { network } = metamaskNetworksViaChainId(provider.chainId);
            // console.info('metamask network : ', network);
            setMetamaskNetwork(network);
            setMetamaskChainId(provider.chainId);

            setTimeout(() => {
                setLoadingMetamask(false);
            }, 2000);
        } catch (err) {
            console.error("loadMetamask: error loading: ", err);
            setTimeout(() => {
                setLoadingMetamask(false);
            }, 2000);
        }
    };

    React.useEffect(() => {
        loadMetamask();
    }, [account]);

    React.useEffect(() => {
        (async () => {
            try {
                window.ethereum.on("accountsChanged", async (accounts) => {
                    if (accounts.length && accounts[0] === account) {
                        // will not do anything
                    } else {
                        document.location.reload();
                        if (accounts.length === 0) {
                            // console.info('No account connected!');
                            const metamaskInitObj = {
                                account: null,
                                hasError: false,
                                errorInfo: null,
                            };
                            const jsonValue = JSON.stringify(metamaskInitObj);
                            await window.sessionStorage.removeItem("@metamask");
                            await window.sessionStorage.setItem("@metamask", jsonValue);
                            await updateStates(metamaskInitObj);
                        }

                        if (accounts.length > 0 && accounts[0] !== account) {
                            // console.info('account changed!');
                            const accBalance = await metamaskBalance(accounts[0]);
                            setBalance(accBalance);
                            const metamaskInitObj = {
                                account: accounts[0],
                                hasError: false,
                                errorInfo: null,
                            };
                            const jsonValue = JSON.stringify(metamaskInitObj);
                            await window.sessionStorage.removeItem("@metamask");
                            await window.sessionStorage.setItem("@metamask", jsonValue);

                            await updateStates(metamaskInitObj);
                        }
                    }
                });

                window.ethereum.on("chainChanged", async (chainId) => {
                    document.location.reload();
                });
                const provider = await detectEthereumProvider();
                // console.info('metamask current provider chainID: ', provider.chainId);
                const { network } = metamaskNetworksViaChainId(provider.chainId);
                // console.info('metamask network : ', network);
                setMetamaskNetwork(network);
                setMetamaskChainId(provider.chainId);
            } catch (err) {
                console.error("metamask.connect.context: on mount: error : ", err);
            }
        })();
    }, []);

    return (
        <MetamaskConnectContext.Provider
            value={{
                loadingMetamask,
                handleSwitchMetamaskNetwork,
                account,
                balance,
                metamaskNetwork,
                isMetamaskNetworkValid,
                isMetamaskNetworkBsc,
                isMetamaskNetworkAvalanche,
                metamaskChainIdName,
                hasError,
                errorInfo,
                metamaskInitialization: onMetamaskInit,
                resetMetamask: onMetamaskReset,
            }}
        >
            {children}
        </MetamaskConnectContext.Provider>
    );
};

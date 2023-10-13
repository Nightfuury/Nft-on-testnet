import React from "react";

import { requestAllowance, requestApproveAllowance } from '../../services/token.service';
import { RPCURL, METAMASK } from "../../utils/constants/constants";
import { MetamaskContext } from "../metamask/metamask.context";

import {
    createNFT,
    setBaseURI,
    getTokens,
    getTotalSupply,
    getPrice,
    getOwnerOf,
    setApprovalForAll,
    listForSale
} from "../../services/nft.service";

const nftAddress = '0x09AE2be3126C2993d2307B3fBaA10D46e95e9087';
export const NftContext = React.createContext();

export const NftContextProvider = ({ children }) => {
    const { connectedAccount } = React.useContext(MetamaskContext);

    const [allowance, setAllowance] = React.useState(null);
    const [totalSup, setTotalSup] = React.useState(0);
    const [tokenList, setTokenList] = React.useState(null);

    const fetchAllowance = async (accountAddress) => {
        const tokenAllowanceValue = await requestAllowance({
            accountAddress: accountAddress,
            stakingAddress: nftAddress,
            tokenAddress: nftAddress,
            blockchain: 'rinkeby',
            network: 'testnet',
            instance: METAMASK,
        });

        if (tokenAllowanceValue != null) {
            setAllowance(tokenAllowanceValue);
        }
    }


    const handleApproveTokens = async (accountAddress) => {

        await requestApproveAllowance({
            accountAddress: accountAddress,
            stakingAddress: nftAddress,
            tokenAddress: nftAddress,
            blockchain: 'rinkeby',
            network: 'testnet',
            instance: METAMASK,
            amount: "9999999999",
        });

        await fetchAllowance(accountAddress);

    };



    const handleCreateNft = async ({ tokenUri, accountAddress }) => {

        const res = await createNFT({
            userAddress: accountAddress,
            blockchain: 'rinkeby',
            network: 'testnet',
            instance: METAMASK,
            tokenUri: `ipfs://${tokenUri}`
        });

        return res;

    }

    const handleGetTokens = async () => {

        let arr = [];

        for (let i = 0; i < totalSup; i++) {

            const res = await getTokens({
                blockchain: 'rinkeby',
                network: 'testnet',
                instance: METAMASK,
                tokenId: i
            });
            arr.push(res);
        }
        return arr;
    }


    const handleGetTotalSupply = async () => {
        const res = await getTotalSupply({
            blockchain: 'rinkeby',
            network: 'testnet',
            instance: METAMASK
        });

        if (res) {
            setTotalSup(res);
        }
    }

    const handleGetPrice = async () => {
        const res = await getPrice({
            blockchain: 'rinkeby',
            network: 'testnet',
            instance: METAMASK
        });
    }

    const handleGetOwner = async () => {
        const res = await getOwnerOf({
            blockchain: 'rinkeby',
            network: 'testnet',
            instance: METAMASK,
            owner: connectedAccount
        });
    }


    const handleGetApprovalForAll = async () => {
        await setApprovalForAll({
            blockchain: 'rinkeby',
            network: 'testnet',
            instance: METAMASK
        });
    }

    const handleListNft = async ({ userAddress, tokenId, price }) => {
        await listForSale({
            blockchain: 'rinkeby',
            network: 'testnet',
            instance: METAMASK,
            userAddress: userAddress,
            tokenId: tokenId,
            price: price
        });
    }

    // const handleSetBaseUri = async () => {
    //     await setBaseURI({
    //         blockchain: 'rinkeby',
    //         network: 'testnet',
    //         instance: METAMASK
    //     });
    // }

    const fetchData = async () => {
        await handleGetTotalSupply();
        await handleGetPrice();
        await handleGetOwner();
    }


    React.useEffect(() => {
        fetchData();
    }, [])



    return (
        <NftContext.Provider
            value={{
                allowance,
                totalSup,
                tokenList,
                handleCreateNft,
                fetchAllowance,
                handleApproveTokens,
                handleGetTokens,
                handleGetTotalSupply,
                handleGetApprovalForAll,
                handleListNft
            }}>
            {children}
        </NftContext.Provider>
    )
}
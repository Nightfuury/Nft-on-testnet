import { retrieveContractInstance } from "./contract/contract.instance.service";
import { initWeb3 } from './web3.service';

import { nftAbi } from '../utils/abi/nft/nft.abi';
import { saleNftABI } from "../utils/abi/nft/nft.sale.abi";
import { marketContractABI } from "../utils/abi/nft/nft.market.abi";

import { metadataIPFSBase } from "../utils/constants/constants";

const nftAddress = '0x09AE2be3126C2993d2307B3fBaA10D46e95e9087';
const nftSaleAddr = "0x621Ef5806911D8dA870Df9b2b420D34628FA1d08";
const marketContract = "0x9F095D4F427Df006F1EeD966842aAc52Bd281Df2";


export const createNFT = async ({
    userAddress,
    blockchain,
    network,
    instance,
    tokenUri
}) => {
    try {
        const web3 = await initWeb3({
            blockchain: blockchain,
            network: network,
            instance: instance,
        });

        const nftContractInstance = await retrieveContractInstance({
            abi: nftAbi,
            address: nftAddress,
            blockchain,
            network,
            instance,
        });

        nftContractInstance.options.gasPrice = 1500000000;

        const res = await nftContractInstance.methods
            .mintNFT(tokenUri)
            .send({
                from: userAddress,
                to: nftAddress,
                value: 10000000000000000
            });

        return res;

    } catch (err) {
        console.error("createNFT: error: ", err);
    }
};




export const setBaseURI = async ({
    blockchain,
    network,
    instance,
}) => {
    try {

        const nftContractInstance = await retrieveContractInstance({
            abi: saleNftABI,
            address: nftSaleAddr,
            blockchain,
            network,
            instance,
        });


        await nftContractInstance.methods
            .setBaseURI(metadataIPFSBase)
            .call();

    } catch (err) {
        console.error("setBaseURI: error: ", err);
    }
};



export const getTokens = async ({
    blockchain,
    network,
    instance,
    tokenId
}) => {
    try {

        const nftContractInstance = await retrieveContractInstance({
            abi: nftAbi,
            address: nftAddress,
            blockchain,
            network,
            instance,
        });


        const res = await nftContractInstance.methods
            .tokenURI(tokenId)
            .call();

        return res;

    } catch (err) {
        console.error("getTokens: error: ", err);
    }
};


export const getTotalSupply = async ({
    blockchain,
    network,
    instance,
}) => {
    try {
        const web3 = await initWeb3({
            blockchain: blockchain,
            network: network,
            instance: instance,
        });

        const nftContractInstance = await retrieveContractInstance({
            abi: nftAbi,
            address: nftAddress,
            blockchain,
            network,
            instance,
        });


        const res = await nftContractInstance.methods
            .totalSupply()
            .call();

        return res;

    } catch (err) {
        console.error("getTotalSupply: error: ", err);
    }
};


export const getPrice = async ({
    blockchain,
    network,
    instance,
}) => {
    try {

        const nftContractInstance = await retrieveContractInstance({
            abi: nftAbi,
            address: nftAddress,
            blockchain,
            network,
            instance,
        });


        const res = await nftContractInstance.methods
            .PRICE()
            .call();

        console.log('getPrice', res)

    } catch (err) {
        console.error("getPrice: error: ", err);
    }
};



export const getOwnerOf = async ({
    blockchain,
    network,
    instance,
    owner
}) => {
    try {

        const nftContractInstance = await retrieveContractInstance({
            abi: nftAbi,
            address: nftAddress,
            blockchain,
            network,
            instance,
        });


        const res = await nftContractInstance.methods
            .balanceOf(owner)
            .call();

        console.log('getOwnerOf', res)

    } catch (err) {
        console.error("getOwnerOf: error: ", err);
    }
};





export const setApprovalForAll = async ({
    blockchain,
    network,
    instance,
}) => {
    try {

        const nftContractInstance = await retrieveContractInstance({
            abi: nftAbi,
            address: nftAddress,
            blockchain,
            network,
            instance,
        });


        await nftContractInstance.methods
            .setApprovalForAll(marketContract, true)
            .call();


    } catch (err) {
        console.error("setApprovalForAll: error: ", err);
    }
};


export const listForSale = async ({
    blockchain,
    network,
    instance,
    userAddress,
    tokenId,
    price
}) => {
    try {
        const web3 = await initWeb3({
            blockchain: blockchain,
            network: network,
            instance: instance,
        });

        const nftContractInstance = await retrieveContractInstance({
            abi: marketContractABI,
            address: marketContract,
            blockchain,
            network,
            instance,
        });


        await nftContractInstance.methods
            .createMarketItem(nftAddress, tokenId, web3.utils.toWei(String(price), "ether"))
            .send({
                from: userAddress,
                to: marketContract
            });



    } catch (err) {
        console.error("listForSale: error: ", err);
    }
};


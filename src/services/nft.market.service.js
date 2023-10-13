import { retrieveContractInstance } from "./contract/contract.instance.service";
import { initWeb3 } from './web3.service';

import { nftAbi } from '../utils/abi/nft/nft.abi';
import { saleNftABI } from "../utils/abi/nft/nft.sale.abi";
import { marketContractABI } from "../utils/abi/nft/nft.market.abi";


const nftAddress = '0x09AE2be3126C2993d2307B3fBaA10D46e95e9087';
const nftSaleAddr = "0x621Ef5806911D8dA870Df9b2b420D34628FA1d08";
const marketContract = "0x9F095D4F427Df006F1EeD966842aAc52Bd281Df2";


export const getMarketItems = async ({
    blockchain,
    network,
    instance,
}) => {
    try {

        const nftContractInstance = await retrieveContractInstance({
            abi: marketContractABI,
            address: marketContract,
            blockchain,
            network,
            instance,
        });


        const res = await nftContractInstance.methods
            .fetchMarketItems()
            .call()

        return res;

    } catch (err) {
        console.error("getMarketItems: error: ", err);
    }
};



export const createMarketSale = async ({
    buyer,
    owner,
    blockchain,
    network,
    instance,
    itemId,
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


        const res = await nftContractInstance.methods
            .createMarketSale(marketContract, itemId)
            .send({
                from: buyer,
                to: owner,
                value: price
            });

        return res;

    } catch (err) {
        console.error("createMarketSale: error: ", err);
    }
};

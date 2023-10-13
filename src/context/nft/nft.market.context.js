import React from "react";

import { RPCURL, METAMASK } from "../../utils/constants/constants";
import { MetamaskContext } from "../metamask/metamask.context";

import { getMarketItems, createMarketSale } from "../../services/nft.market.service";
import {
    getTokens
} from "../../services/nft.service";


export const NftMarketContext = React.createContext();

export const NftMarketContextProvider = ({ children }) => {
    const { connectedAccount } = React.useContext(MetamaskContext);

    const handleGetMarketItems = async () => {

        const res = await getMarketItems({
            blockchain: 'rinkeby',
            network: 'testnet',
            instance: METAMASK
        })

        return res;
    }

    const getSingleTokenDetail = async (tokenId) => {

        const res = await getTokens({
            blockchain: 'rinkeby',
            network: 'testnet',
            instance: METAMASK,
            tokenId: tokenId
        });

        return res;
    }



    const handleCreateMarketSale = async ({ buyer, owner, itemId, price }) => {

        await createMarketSale({
            buyer: buyer,
            owner: owner,
            blockchain: 'rinkeby',
            network: 'testnet',
            instance: METAMASK,
            itemId: itemId,
            price: price
        });

    }


    return (
        <NftMarketContext.Provider
            value={{
                handleGetMarketItems,
                getSingleTokenDetail,
                handleCreateMarketSale
            }}>
            {children}
        </NftMarketContext.Provider>
    )

}
import React from "react";

import { NftContext } from "../context/nft/nft.context";
import { MetamaskContext } from "../context/metamask/metamask.context";

function ListForSale({ id }) {
    const {
        handleGetApprovalForAll,
        handleListNft
    } = React.useContext(NftContext);

    const { connectedAccount } = React.useContext(MetamaskContext);


    const [price, setPrice] = React.useState(null);

    const priceChangeHandler = (event) => {
        setPrice(event.target.value);
    }

    return (
        <div style={{ margin: '2rem 0' }}>
            <button style={{ margin: '0.5rem' }}
                onClick={() => handleGetApprovalForAll()}>Approve</button>

            <div>
                <input
                    type="number"
                    name='price'
                    placeholder="Enter price for your nft"
                    value={price}
                    onChange={priceChangeHandler}
                    style={{ margin: '0.5rem' }} />

                <button style={{ margin: '0.5rem' }}
                    onClick={() => handleListNft({
                        userAddress: connectedAccount,
                        tokenId: id,
                        price: price
                    })}>List on Marketplace</button>
            </div>
        </div>
    )
}

export default ListForSale;
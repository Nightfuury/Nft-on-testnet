import React from "react";

import { NftMarketContext } from "../context/nft/nft.market.context";

import MarketItem from "../components/MarketItem";

function MarketItems() {

    const {
        handleGetMarketItems
    } = React.useContext(NftMarketContext);

    const [loading, setLoading] = React.useState(true);
    const [marketList, setmarketList] = React.useState(null);

    const fetchDetails = async () => {
        const res = await handleGetMarketItems();

        if (res) {
            setmarketList(res);
            setLoading(false);
        }
        console.log('market items', res);
    }

    React.useEffect(() => {
        fetchDetails()
    }, [])

    return (
        <div>
             <h1 style={{textAlign : 'center' , margin : '2rem auto'}}>Market Items</h1>
            {
                loading && <p>Loading....</p>
            }

            <div style={{
                display: 'flex'
            }}>
               
                {
                    !loading && marketList && marketList.map((a, index) => (
                        <MarketItem
                            key={index}
                            item={a} />
                    ))
                }

            </div>
        </div>
    );
}

export default MarketItems;
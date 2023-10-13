import React from "react";

import { shortAddress } from "../utils/format/address.format";

import { formatIpfsLink } from "../utils/format/ipfs.link.format";
import { NftMarketContext } from "../context/nft/nft.market.context";
import { MetamaskContext } from "../context/metamask/metamask.context";

import { initWeb3 } from "../services/web3.service";

function MarketItem({ item }) {
    const { getSingleTokenDetail, handleCreateMarketSale } = React.useContext(NftMarketContext);
    const { connectedAccount } = React.useContext(MetamaskContext);


    const [loading, setLoading] = React.useState(true);
    const [name, setName] = React.useState(null);
    const [image, setImage] = React.useState(null);
    const [det, setDetial] = React.useState(null);
    const [price, setPrice] = React.useState(null);

    const fetchDetails = async () => {
        setLoading(true);

        const web3 = await initWeb3({ blockchain: 'rinkeby', network: 'testnet', instance: 'metamask' });
        setPrice(web3.utils.fromWei(item.price, "ether"));

        const res = await getSingleTokenDetail(item.tokenId);

        if (res) {
            fetchTokenData(res)
        }
    }


    const fetchTokenData = async (tokenLink) => {

        const link = formatIpfsLink(tokenLink);

        const options = { method: 'GET' };

        fetch(`${link}`, options)
            .then(response => response.json())
            .then(response => {

                const imgLink = formatIpfsLink(response.image);

                setName(response.name);
                setDetial(response.description);
                setImage(imgLink);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(true);
            });


    }


    const handleBuy = async () => {
        await handleCreateMarketSale({
            buyer : connectedAccount,
            owner : item.seller,
            itemId : item.itemId,
            price : item.price
        })
    }

    React.useEffect(() => {
        fetchDetails()
    }, [])



    return (
        <div style={{ margin: 'auto 2rem', border: '1px dashed grey', padding: '0.5rem', borderRadius: '10px' }}>
            {
                loading ? <p>Loading....</p>
                    :
                    <div>
                        <img src={image} style={{ height: '200px', width: '200px' }} />
                        <p>Name : {name}</p>
                        <p>Detail : {det}</p>
                        <p>Contract : {shortAddress(item.nftContract, 10)}</p>
                        <p>Seller :  {shortAddress(item.seller, 10)}</p>
                        <p>Price : {price} ETH</p>


                        {
                            (connectedAccount != item.seller) ? <button onClick={handleBuy}>Buy</button> : null
                        }
                    </div>
            }
        </div>
    );
}

export default MarketItem;
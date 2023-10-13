import React from "react";

import ListForSale from "../components/ListforSale";

import { formatIpfsLink } from "../utils/format/ipfs.link.format";

function TokenFormat({ tokenId, item }) {
 
    const [loading, setLoading] = React.useState(true);

    const [name, setName] = React.useState(null);
    const [image, setImage] = React.useState(null);
    const [det, setDetial] = React.useState(null);

    const [viewSale, setViewSale] = React.useState(false);

    const listForSaleClick = () => {
        setViewSale(!viewSale);
    }


    const fetchData = async () => {
        setLoading(true);

        const link = formatIpfsLink(item);

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


    React.useEffect(() => {
        fetchData();
    }, [item])


    return (
        <div style={{ margin: 'auto 2rem', border: '1px dashed grey', padding: '0.5rem', borderRadius: '10px' }}>
            {
                loading ? <p>Loading....</p>
                    :
                    <div>
                        <img src={image} style={{ height: '200px', width: '200px' }} />
                        <p>{name}</p>
                        <p>{det}</p>

                        {
                            viewSale ? <button onClick={listForSaleClick} style={{ cursor: 'pointer' }}>Close</button> :
                                <button onClick={listForSaleClick} style={{ cursor: 'pointer' }}> List for Sale</button>
                        }



                        {
                            viewSale ? <ListForSale id={tokenId} /> : null
                        }


                    </div>
            }
        </div>
    );
}

export default TokenFormat;
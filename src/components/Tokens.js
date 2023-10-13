import React from "react";

import { NftContext } from "../context/nft/nft.context";
import { formatIpfsLink } from "../utils/format/ipfs.link.format";

function Tokens() {
    const {
        handleGetTokens
    } = React.useContext(NftContext);

    const [name, setName] = React.useState(null);
    const [image, setImage] = React.useState(null);
    const [det, setDetial] = React.useState(null);

    const [loading, setLoading] = React.useState(false);

    const tokensList = async () => {
        setLoading(true);

        const res = await handleGetTokens();
        const link = formatIpfsLink(res);

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
        tokensList();
    }, [])

    return (
        <div>
            {
                loading ? <p>Loading....</p>
                    :
                    <div>
                        <img src={image} style={{ height: '200px', width: '200px' }} />
                        <p>{name}</p>
                        <p>{det}</p>
                    </div>
            }
        </div>
    );
}

export default Tokens;
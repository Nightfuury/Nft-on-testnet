import React from "react";

import { NftContext } from "../context/nft/nft.context";
import TokenFormat from "./tokensFormat";

function TokenList() {
    const {
        tokenList,
        totalSup,
        handleGetTokens
    } = React.useContext(NftContext);

    const [loading, setLoading] = React.useState(true);
    const [tokensArr, setTokensArr] = React.useState(null);

    const fetchData = async () => {
        const res = await handleGetTokens();
        setTokensArr(res);
        setLoading(false);
    }


    React.useEffect(() => {
        fetchData();
    }, [totalSup])

    return (
        <div>
            {
                loading && <p>Loading....</p>
            }

            <div style={{
                display: 'flex'
            }}>
                {
                    !loading && tokensArr && tokensArr.map((a, index) => (
                        <TokenFormat
                            key={index}
                            item={a}
                            tokenId={index} />
                    ))
                }

            </div>
        </div>
    );
}

export default TokenList;
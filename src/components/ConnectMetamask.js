import React from "react";

import { MetamaskContext } from "../context/metamask/metamask.context";
import { shortAddress } from '../utils/format/address.format';
import { deploymentEnv } from '../utils/constants/constants';
import { fetchNetworkData } from "../utils/config/network.config";

function ConnectMetamask() {
    const { handleMetamaskConnection, connectedAccount, connectedNetwork } = React.useContext(MetamaskContext);
    const [blockchainBaseURL, setBlockchainBaseURL] = React.useState(null);

    React.useEffect(() => {
        if (
            connectedNetwork != null &&
            connectedNetwork === 'BSC Mainnet'
        ) {
            setBlockchainBaseURL(
                fetchNetworkData({ blockchain: 'bsc', network: deploymentEnv })
                    .blockExplorerUrls[0]
            );
        }

        if (
            connectedNetwork != null &&
            connectedNetwork === 'Avalanche Mainnet'
        ) {
            setBlockchainBaseURL(
                fetchNetworkData({ blockchain: 'avalanche', network: deploymentEnv })
                    .blockExplorerUrls[0]
            );
        }

        if (
            connectedNetwork != null &&
            connectedNetwork === 'Fantom Mainnet'
        ) {
            setBlockchainBaseURL(
                fetchNetworkData({ blockchain: 'fantom', network: deploymentEnv })
                    .blockExplorerUrls[0]
            );
        }
    }, [connectedNetwork]);


    return (
        <div>
            {!connectedAccount && (
                <button
                    className="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#kt_modal_create_app"
                    id="kt_toolbar_primary_button"
                    onClick={() => handleMetamaskConnection()}
                >Connect Wallet</button>
            )}

            {connectedAccount != null && (
                <button
                    className="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#kt_modal_create_app"
                    id="kt_toolbar_primary_button"
                >
                    {shortAddress(connectedAccount, 10)}
                </button>
            )}
        </div>
    )
}

export default ConnectMetamask;
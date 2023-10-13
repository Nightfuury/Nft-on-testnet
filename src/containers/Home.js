import React from "react";

import ConnectMetamask from '../components/ConnectMetamask';
import CreatNft from '../components/CreatNft';
import TokenList from './tokenList';

function Home() {
    return (
        <div>
            <ConnectMetamask />

            <a href="/market" target="_blank" style={{marginTop : '2rem'}}>Market</a>

            <CreatNft />
            <TokenList />
        </div>
    );
}

export default Home;
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { MetamaskConnectContextProvider } from './context/metamask/metamask.connect.context';
import { MetamaskContextProvider } from './context/metamask/metamask.context';
import { NftContextProvider } from './context/nft/nft.context';
import { NftMarketContextProvider } from './context/nft/nft.market.context';

import Home from './containers/Home';
import MarketItems from './containers/marketItems';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <MetamaskContextProvider>
          <MetamaskConnectContextProvider>
            <NftContextProvider>
              <NftMarketContextProvider>

                <Routes>
                  <Route path="/market" element={<MarketItems />} />
                  <Route path="/" element={<Home />} />
                </Routes>


              </NftMarketContextProvider>
            </NftContextProvider>
          </MetamaskConnectContextProvider>
        </MetamaskContextProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;

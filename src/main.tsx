import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// OnchainKit
import '@coinbase/onchainkit/styles.css';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';

const apiKey = import.meta.env.VITE_ONCHAINKIT_API_KEY;

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <OnchainKitProvider
      apiKey={apiKey}      // or remove this and pass rpcUrl="https://..." if you use your own RPC
      chain={base}         // choose the chain you want (base, mainnet, etc.)
    >
      <App />
    </OnchainKitProvider>
  </React.StrictMode>
);

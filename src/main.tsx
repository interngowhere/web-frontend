import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import { DevProviders, Providers } from './Providers.tsx';
import './index.css';

const env = import.meta.env.VITE_NODE_ENV;

const root =
    env == 'dev' ? (
        <React.StrictMode>
            <DevProviders>
                <Providers>
                    <App />
                </Providers>
            </DevProviders>
        </React.StrictMode>
    ) : (
        <Providers>
            <App />
        </Providers>
    );

ReactDOM.createRoot(document.getElementById('root')!).render(root);

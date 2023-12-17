import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
// import { registerServiceWorker } from "./register-sw";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <App />
);

//ServiceWorkerの有効化
// registerServiceWorker();
serviceWorkerRegistration.unregister();
reportWebVitals();

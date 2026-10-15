import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Notifications from './components/Notifications';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './fonts.css';
import './index.css';
import { PublicDataProvider } from './context/PublicDataContext';

const application = (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Notifications />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
const root = document.getElementById('root');
if (root.dataset.prerendered === 'true') ReactDOM.hydrateRoot(root, application);
else ReactDOM.createRoot(root).render(application);

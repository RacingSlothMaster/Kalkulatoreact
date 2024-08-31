import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Settings from './Settings.jsx';
import './index.css';
import Review from './Review.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Review />
    <App />
    <Settings />
  </React.StrictMode>,
);